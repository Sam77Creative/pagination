import { IPaginationOptions } from "../src/interfaces/core.interfaces";

// Get the url for the paginated api
export const url: string =
  "https://seura-development.77mke.com/wordpress/wp-json/wp/v2/products";

// Create the opts object for Pagination
export const wpOpts: IPaginationOptions = {
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
