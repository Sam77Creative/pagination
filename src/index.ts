import {
  IPaginationOptions,
  IPaginationResponse,
  IPaginationWorker
} from "./interfaces/core.interfaces";
import { Observable, Subject } from "rxjs";
import * as request from "request";
import { setupCore } from "./core";
import { isFunction } from "./utilities";
import * as _ from "underscore";

/**
 * Given a paginated api, process the data as an Observable
 * @param url
 * @param opts
 */
export default abstract class Pagination {
  static of<T extends any>(
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

  static bundle<T extends any>(
    url: string,
    incomingOpts: IPaginationOptions
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {
      // Create bundle
      let bundle: T[] = [];

      // Subscribe to of
      this.of(url, incomingOpts).subscribe((res: IPaginationResponse<T>) => {
        if (res.error) {
          throw res.error;
        }

        // Get the next data set and concat to the bundle
        if (res.payload) {
          const data: T = res.payload;
          if (Array.isArray(data)) {
            bundle = bundle.concat(data);
          } else {
            bundle.push(data);
          }
        } else {
          throw new Error("Payload is undefined");
        }

        // Do we have all of the records
        if (res.more) {
          // Get the next set of records
          res.next();
        } else {
          res.finish();

          // Resolve the bundle
          resolve(bundle);
        }
      });
    });
  }

  static find<T extends any>(
    url: string,
    incomingOpts: IPaginationOptions,
    identifier: any | Function
  ): Promise<T | undefined> {
    return new Promise((resolve, reject) => {
      // Subscribe to of
      this.of(url, incomingOpts).subscribe(
        async (res: IPaginationResponse<T>) => {
          // If the identifier is a function, fun it with the payload
          if (isFunction(identifier)) {
            if (await identifier(res.payload)) {
              resolve(res.payload);
              res.finish();
            } else {
              if (res.more) {
                res.next();
              } else {
                resolve();
                res.finish();
              }
            }
          } else {
            if (_.isMatch(res.payload, identifier)) {
              resolve(res.payload);
              res.finish();
            } else {
              if (res.more) {
                res.next();
              } else {
                resolve();
                res.finish();
              }
            }
          }
        }
      );
    });
  }

  static filter<T extends any>(
    url: string,
    incomingOpts: IPaginationOptions,
    identifier: any | Function
  ): Promise<T[]> {
    return new Promise((resolve, reject) => {});
  }
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
        }
      );
    },
    finish: () => {
      // Unsubscribe the observer from Pagination
      observer.unsubscribe();

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
