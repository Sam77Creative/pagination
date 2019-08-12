import { IPaginationOptions } from "../interfaces/core.interfaces";

export const WordpressOpts: IPaginationOptions = {
  page: {
    headerLink: {
      header: "link"
    }
  },
  recordsPerPage: 10,
  type: "JSON"
};
