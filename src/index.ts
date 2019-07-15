import {
  IPaginationOptions,
  IPaginationResponse,
  IPaginationWorker
} from "./interfaces/core.interfaces";
import { Observable, Subject } from "rxjs";
import * as request from "request";
import { setupCore } from "./core";

/**
 * Given a paginated api, process the data as an Observable
 * @param url
 * @param opts
 */
export default function Pagination<T extends any>(
  url: string,
  incomingOpts: IPaginationOptions
): Observable<IPaginationResponse<T>> {
  // Setup default options
  const { opts, worker } = setupCore(incomingOpts);

  // Create and return the primary Observable
  return Observable.create(
    async (observer: Subject<IPaginationResponse<T>>) => {
      // Create the response object
      await createResponseObject(url, opts, worker, observer);
    }
  );
}

async function createResponseObject<T extends any>(
  url: string,
  opts: IPaginationOptions,
  worker: IPaginationWorker,
  observer: Subject<IPaginationResponse<T>>
): Promise<IPaginationResponse<T>> {
  const pagRes: IPaginationResponse<T> = {
    error: null,
    page: opts.start ? opts.start : 1,
    totalRecords: 0,
    payload: undefined,
    next: async () => {
      request(
        getNextRequest(url, opts, worker),
        (err: Error, res: request.Response, body: string) => {
          // Write the error out
          if (err) {
            pagRes.error = err;
            throw err;
          }

          // Put the body into the payload ASSUMING JSON
          pagRes.payload = JSON.parse(body);

          // Get the total records
          if (!pagRes.totalRecords) {
            pagRes.totalRecords = getTotalRecords(res, opts);
          }

          // Keep track of the records per page
          if (pagRes.payload) {
            pagRes.recordsPerPage =
              pagRes.payload.length > pagRes.recordsPerPage
                ? pagRes.payload.length
                : pagRes.recordsPerPage;
          }

          // Increment the workers current page
          ++worker.currentPage;

          // Set the page to the worker current page minus one
          pagRes.page = worker.currentPage - 1;

          // Will there be more pages?
          if (pagRes.recordsPerPage * pagRes.page >= pagRes.totalRecords) {
            pagRes.more = false;
          } else {
            pagRes.more = true;
          }

          // Next it to the observer
          observer.next(pagRes);

          // If there is more, get it. Otherwise complete
          if (pagRes.more) {
            pagRes.next();
          } else {
            pagRes.finish();
          }
        }
      );
    },
    finish: () => {
      // Complete the observable
      observer.complete();
    },
    more: true,
    recordsPerPage: 0
  };

  // Kick it off
  pagRes.next();

  return pagRes;
}

function getTotalRecords(
  res: request.Response,
  opts: IPaginationOptions
): number {
  if (opts.totalRecords.header) {
    const strNum: string | string[] | undefined =
      res.headers[opts.totalRecords.header];
    if (!strNum) {
      throw new Error("Total records cannot be falsy");
    } else if (Array.isArray(strNum)) {
      throw new Error("Total records cannot be an array");
    } else {
      return parseInt(strNum as string);
    }
  } else {
    throw new Error("Not yet implemented");
  }
}

function getNextRequest(
  url: string,
  opts: IPaginationOptions,
  worker: IPaginationWorker
): request.Options {
  if (opts.page.query) {
    return {
      url: url + "?" + opts.page.query + "=" + worker.currentPage
    };
  } else if (opts.page.header) {
    return {
      url: url,
      headers: {
        [opts.page.header]: worker.currentPage
      }
    };
  } else {
    throw new Error("Not yet implemented");
  }
}
