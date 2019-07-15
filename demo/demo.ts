import Pagination from "../src/index";
import {
  IPaginationResponse,
  IPaginationOptions
} from "../src/interfaces/core.interfaces";
import * as fs from "fs";
import { map, tap, catchError, reduce, last } from "rxjs/operators";
import { Observable } from "rxjs";

// Get the url for the paginated api
const url: string =
  "https://seura-development.77mke.com/wordpress/wp-json/wp/v2/products";

// Create the opts object for Pagination
const wpOpts: IPaginationOptions = {
  totalRecords: {
    header: "x-wp-total"
  },
  totalPages: {
    header: "x-wp-totalpages"
  },
  page: {
    query: "page"
  }
};

Pagination(url, wpOpts)
  .pipe(
    tap((res: IPaginationResponse<IPayload[]>) =>
      console.log(`Page ${res.page}`)
    ),
    catchError(
      (err: Error, caught: Observable<IPaginationResponse<IPayload[]>>) => {
        console.log(err);
        return caught;
      }
    ),
    reduce(
      (acc: IPayload[], val: IPaginationResponse<IPayload[]>) =>
        val.payload ? acc.concat(val.payload) : acc,
      []
    ),
    last()
  )
  .subscribe((bundle: IPayload[]) => {
    console.log(bundle.length);
  });

// // Setup the pagination
// Pagination(url, wpOpts).subscribe((res: IPaginationResponse<IPayload[]>) => {
//   if (res.error) {
//     handle(res.error);
//   }

//   // Log the current page number
//   console.log(`Got page ${res.page}`);

//   // Get the next data set and concat to the bundle
//   if (res.payload) {
//     const data: IPayload[] = res.payload;
//     bundle = bundle.concat(data);
//   } else {
//     throw new Error("Payload is undefined");
//   }

//   // Do we have all of the records
//   if (res.more) {
//     // Get the next set of records
//     res.next();
//   } else {
//     // Finish Pagination
//     res.finish();
//     console.log(`Finished with ${bundle.length} total records.`);

//     // Write to a local file
//     fs.writeFileSync("./demo/data.json", JSON.stringify(bundle));
//     console.log("Wrote to /demo/data.json");
//   }
// });

// /**
//  * Basic error handler
//  * @param err Error
//  */
// function handle(err: Error) {
//   throw err;
// }

interface IPayload {
  id: number;
  name: string;
}
