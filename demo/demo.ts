import Pagination from "../src/index";
import {
  IPaginationResponse,
  IPaginationOptions
} from "../src/interfaces/core.interfaces";
import * as fs from "fs";

// Get the url for the paginated api
const url: string =
  "https://seura-development.77mke.com/wordpress/wp-json/wp/v2/products";

// Create the opts object for Pagination
// @ts-ignore
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

// Create a bundle array to hold all of the records
let bundle: IPayload[] = [];

// Setup the pagination
Pagination(url, wpOpts).subscribe((res: IPaginationResponse<IPayload[]>) => {
  if (res.error) {
    handle(res.error);
  }

  // Log the current page number
  console.log(`Got page ${res.page}`);

  // Get the next data set and concat to the bundle
  if (res.payload) {
    const data: IPayload[] = res.payload;
    bundle = bundle.concat(data);
  } else {
    throw new Error("Payload is undefined");
  }

  // Do we have all of the records
  if (bundle.length === res.totalRecords) {
    // Finish Pagination
    res.finish();

    console.log(`Finished with ${bundle.length} total records.`);

    // Write to a local file
    fs.writeFileSync("./demo/data.json", JSON.stringify(bundle));
    console.log("Wrote to /demo/data.json");
  } else {
    // Get the next set of records
    res.next();
  }
});

/**
 * Basic error handler
 * @param err Error
 */
function handle(err: Error) {
  throw err;
}

interface IPayload {
  id: number;
  name: string;
}
