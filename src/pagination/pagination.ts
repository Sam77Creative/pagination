import * as request from "request";
import { Subject } from "rxjs";
import { INextHeaders } from "../interfaces/core.interfaces";

export function BuildPagination() {
  return function Pagination<T extends any>(
    url: string,
    headers?: request.Headers
  ) {
    // Create the sub
    const sub = new Subject();

    // Start the loop
    setTimeout(() => loop(sub, url, headers, true));

    // Return the sub
    return sub;
  };
}

async function loop(
  sub: Subject<any>,
  url: string,
  headers?: request.Headers,
  first?: boolean
) {
  // Make sure we have subscribers
  if (sub.observers.length >= 1 || first) {
    // Make the request
    request(
      {
        url: url,
        headers
      },
      (err: Error, res: any, body: any) => {
        // Next the body
        sub.next(body);

        // Get the next headers
        const nextHeaders = parseNextHeaders(res.headers);

        // Loop again if more records exist
        if (nextHeaders.next) {
          loop(sub, nextHeaders.next, headers);
        }
      }
    );
  }
}

function parseNextHeaders(headers: request.Headers): INextHeaders {
  // Get the link header
  const link = headers.link;

  // Validate
  if (!link) {
    throw new Error("Not a supported paginated api");
  }

  // Create default output
  const nextHeaders: INextHeaders = {
    next: undefined,
    prev: undefined
  };

  // Split into two parts
  const relArray = link.split(", ");

  // Loop through the array
  relArray.forEach((item: string) => {
    // Split
    const split = item.split("; ");

    // Get the url[0]
    const url = split[0].replace("<", "").replace(">", "");

    if (split[1].includes("next")) {
      nextHeaders.next = url;
    } else if (split[1].includes("prev")) {
      nextHeaders.prev = url;
    }
  });

  return nextHeaders;
}