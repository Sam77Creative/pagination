import Pagination from "../src/index";
import { writeFileSync } from "fs";
import { wpOpts, url } from "./constants";
import { IPaginationResponse } from "../src/interfaces/core.interfaces";

/**
 * Bundles an entire paginated set into an array
 */
async function bundle() {
  // Get all of the posts in a bundle
  const bundle = await Pagination.bundle(url, wpOpts);

  // Write to disk
  writeFileSync("./demo/data/bundleDemo.json", JSON.stringify(bundle));
}

/**
 * Find one specific element in the paginated set
 */
async function find() {
  // Find by object identifier
  const idFind = await Pagination.find(url, wpOpts, { id: 12 });

  // Find by callback
  const callFind = await Pagination.find(url, wpOpts, (item: any) => {
    if (item.id === 12) {
      return true;
    } else {
      return false;
    }
  });
}

async function filter() {
  // Find by object identifier
  const idFind = await Pagination.filter(url, wpOpts, { name: "sam" });

  // Find by callback
  const callFind = await Pagination.filter(url, wpOpts, (item: any) => {
    if (item.name === "sam") {
      return true;
    } else {
      return false;
    }
  });
}
