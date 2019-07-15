import {
  IPaginationOptions,
  IPaginationResponse,
  IPaginationWorker,
  IPaginationElement,
  IPaginationHeaderLink
} from "./interfaces/core.interfaces";
import { Observable, Subject, onErrorResumeNext } from "rxjs";
import * as request from "request";

/**
 * Given a paginated api, process the data as an Observable
 * @param url
 * @param opts
 */
export default function Pagination<T extends any>(
  url: string,
  opts: IPaginationOptions
): Observable<IPaginationResponse<T>> {
  // Create and return the primary Observable
  return Observable.create(
    async (observer: Subject<IPaginationResponse<T>>) => {
      // Create the response object and trigger the next function
      const res = createResponseObject(url, opts, observer);
      res.next();
    }
  );
}

function createResponseObject<T extends any>(
  url: string,
  opts: IPaginationOptions,
  observer: Subject<IPaginationResponse<T>>
): IPaginationResponse<T> {
  // Setup defaults
  const res: IPaginationResponse<T> = {
    error: null,
    page: getStartingPage(opts.startPage),
    payload: {} as T,
    more: false,
    next: () => {},
    finish: () => {
      observer.complete();
      observer.unsubscribe();
    }
  };

  // Setup next function
  res.next = next(url, opts, res, observer);

  return res;
}

function next<T extends any>(
  url: string,
  opts: IPaginationOptions,
  pagRes: IPaginationResponse<T>,
  observer: Subject<IPaginationResponse<T>>
): () => void {
  // Setup vars
  let currentPage = pagRes.page;
  let prevHeaders: request.Headers = {};

  // Return the anonymous function
  return async () => {
    // Get the next request object
    const requestObj = getNextRequest(url, opts.page, currentPage, prevHeaders);

    // Make the request
    request(
      requestObj,
      (err: Error | undefined, res: request.Response, body: any) => {
        // Throw an error if needed
        if (err) {
          throw err;
        }

        // Save the current headers
        prevHeaders = res.headers;

        // Parse the body into the payload
        if (opts.type === "JSON") {
          pagRes.payload = JSON.parse(body);
        } else {
          throw new Error("type is not allowed");
        }

        // Keep the page value current
        pagRes.page = currentPage;

        // Set the totalRecords attribute if possible
        if (opts.totalRecords) {
          const newTotal = getTotalRecords(opts.totalRecords, res);
          if (newTotal) {
            pagRes.totalRecords = newTotal;
          }
        }

        // Set the totalPages attribute if possible
        if (opts.totalPages) {
          const newTotal = getTotalPages(opts.totalPages, res);
          if (newTotal) {
            pagRes.totalPages = newTotal;
          }
        }

        // Next the pagRes to the Subject
        observer.next(pagRes);

        // Increment the current page
        ++currentPage;

        // Check if there are more records
        pagRes.more = hasMoreRecords(opts, pagRes, res);
        if (pagRes.more) {
          // If there are more records get them
          pagRes.next();
        } else {
          // Otherwise finish the observable
          pagRes.finish();
        }
      }
    );
  };
}

function getNextRequest(
  url: string,
  page: IPaginationElement,
  currentPage: number,
  prevHeaders: request.Headers
): request.Options {
  if (page.query) {
    return getPageByQuery(url, page.query, currentPage);
  } else if (page.header) {
    throw new Error("This case has not been created yet");
  } else if (page.headerLink) {
    return getPageByHeaderLink(url, page.headerLink, prevHeaders, currentPage);
  } else {
    throw new Error("page configuration needs to be defined");
  }
}

function hasMoreRecords<T extends any>(
  opts: IPaginationOptions,
  pagRes: IPaginationResponse<T>,
  res: request.Response
): boolean {
  // Use the easiest method to see if there are more records
  if (pagRes.totalPages) {
    // Are we on the last page
    if (pagRes.page >= pagRes.totalPages) {
      return true;
    } else {
      return false;
    }
  } else if (pagRes.totalRecords) {
    // Have we grabbed all of the expected records?
    if (opts.recordsPerPage * pagRes.page >= pagRes.totalRecords) {
      return true;
    } else {
      return false;
    }
  } else if (opts.page.headerLink) {
    // Attempt to get the next page via the supplied function if possible, or use our default function
    let url: any;
    if (opts.page.headerLink.callback) {
      url = opts.page.headerLink.callback(res.headers[
        opts.page.headerLink.header
      ] as string);
    } else {
      // Set it to page 2 to trigger the lookup
      url = getPageByHeaderLink("", opts.page.headerLink, res.headers, 2);
    }

    // Check if the url is a blank string, that indicates there are no more records
    if (url.url === "") {
      return false;
    } else {
      return true;
    }
  } else {
    throw new Error("No way to tell if there are more pages");
  }
}

function getTotalPages(
  totalPages: IPaginationElement,
  res: request.Response
): number | undefined {
  if (totalPages.header) {
    // Make sure the header is accessible
    if (res.headers[totalPages.header]) {
      return parseInt(res.headers[totalPages.header] as string);
    } else {
      return;
    }
  } else {
    throw new Error("totalPages configuration not supported");
  }
}

function getTotalRecords(
  totalRecords: IPaginationElement,
  res: request.Response
): number | undefined {
  if (totalRecords.header) {
    // Make sure the header is accessible
    if (res.headers[totalRecords.header]) {
      return parseInt(res.headers[totalRecords.header] as string);
    } else {
      return;
    }
  } else {
    throw new Error("totalRecords configuration not supported");
  }
}

function getPageByHeaderLink(
  url: string,
  page: IPaginationHeaderLink,
  prevHeaders: request.Headers,
  currentPage: number
): request.Options {
  // If the current page is 1 simply return the url
  if (currentPage === 1) {
    return { url: url };
  } else {
    // Make sure that the correct header is accessible
    if (prevHeaders[page.header]) {
      // Get the header data
      const header = prevHeaders[page.header];

      // Use the supplied callbak to parse the header if possible
      if (page.callback) {
        return page.callback(header);
      } else {
        // Use the default header link function
        return parseHeaderLink(url, page, header);
      }
    } else {
      throw new Error("Current page is not 1 but header is not accessible.");
    }
  }
}

function parseHeaderLink(
  baseUrl: string,
  page: IPaginationHeaderLink,
  header: string
): request.Options {
  // Split into parts
  const split = header.split(", ");

  // Build into a map
  const map = split.map((i: any) => {
    return {
      url: i
        .split("; ")[0]
        .replace("<", "")
        .replace(">", ""),
      rel: i.split("rel=")[1].replace(/\"/g, "")
    };
  });

  // Find the 'next' rel
  const next = map.find((m: any) => m.rel === "next");
  if (!next) {
    // Return a blank url field
    return { url: "" };
  } else {
    if (page.queryParam) {
      const param = getQueryParam(next.url, page.queryParam);
      return { url: `${baseUrl}&${page.queryParam}=${param}` };
    } else {
      return { url: next.url };
    }
  }
}

function getQueryParam(url: string, param: string): string {
  const base = url.split(param + "=")[1];
  if (!base) {
    throw new Error("Invalid getQueryParam operation");
  } else {
    return base.split("&")[0];
  }
}

function getPageByQuery(
  url: string,
  attr: string,
  page: number
): request.Options {
  return { url: `${url}?${attr}=${page}` };
}

function getStartingPage(page: any): number {
  if (page) {
    return page;
  } else {
    return 1;
  }
}
