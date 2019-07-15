import { IPaginationOptions } from "../interfaces/core.interfaces";

export const WordpressOpts: IPaginationOptions = {
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
