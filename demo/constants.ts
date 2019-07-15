import { IPaginationOptions } from "../src/interfaces/core.interfaces";

// Get the url for the paginated api
export const wpUrl: string =
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
  },
  recordsPerPage: 10,
  type: "JSON"
};

export const sUrl: string =
  "{APIKEY}@test-seura.myshopify.com/admin/api/2019-07/products.json";

export const sOpts: IPaginationOptions = {
  type: "JSON",
  recordsPerPage: 2,
  page: {
    headerLink: {
      header: "link",
      queryParam: "page_info"
    }
  }
};

export interface IPayload {
  id: number;
  name: string;
}
