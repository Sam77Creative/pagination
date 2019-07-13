import {
  IPaginationOptions,
  IPaginationWorker
} from "./interfaces/core.interfaces";

/**
 * Setup the default options for Pagination
 * @param opts IPaginationOptions
 */
export function setupCore(
  opts: IPaginationOptions
): { opts: IPaginationOptions; worker: IPaginationWorker } {
  // Create the worker
  const worker: IPaginationWorker = {
    currentPage: opts.start ? opts.start : 1
  };

  return { opts, worker };
}
