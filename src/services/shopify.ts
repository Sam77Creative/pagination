import { IPaginationOptions } from "../interfaces/core.interfaces";

export const ShopifyOpts: IPaginationOptions = {
  page: {
    headerLink: {
      header: "link"
    }
  },
  recordsPerPage: 50,
  type: "JSON"
};
