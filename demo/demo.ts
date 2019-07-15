import Pagination from "../src/index";
import {
  IPaginationResponse,
  IPaginationOptions
} from "../src/interfaces/core.interfaces";
import * as fs from "fs";
import { wpOpts, url } from "./constants";

// Create a bundle array to hold all of the records
let bundle: IPayload[] = [];

// Setup the pagination
Pagination.of(url, wpOpts).subscribe((res: IPaginationResponse<IPayload[]>) => {
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
  if (res.more) {
    // Get the next set of records
    res.next();
  } else {
    // Finish Pagination
    res.finish();
    console.log(`Finished with ${bundle.length} total records.`);

    // Write to a local file
    fs.writeFileSync("./demo/data.json", JSON.stringify(bundle));
    console.log("Wrote to /demo/data/demoData.json");
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
