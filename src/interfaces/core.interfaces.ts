import request = require("request");

export interface IPaginationOptions {
  page: IPaginationElement;
  recordsPerPage: number;
  startPage?: number;
  totalRecords?: IPaginationElement | undefined;
  totalPages?: IPaginationElement | undefined;
  type: "JSON"; // More will be added later
}

export interface IPaginationElement {
  header?: string;
  query?: string;
  headerLink?: IPaginationHeaderLink;
}

export interface IPaginationHeaderLink {
  header: string;
  queryParam?: string;
  callback?: (header: string) => request.Options;
}

export interface IPaginationWorker {
  currentPage: number;
}

export interface IPaginationResponse<T> {
  page: number;
  payload: T;
  error: Error | null;
  finish: Function;
  next: Function;
  more: boolean;
  totalRecords?: number;
  totalPages?: number;
}
