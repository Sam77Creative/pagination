import { IPaginationOptions, IPaginationWorker } from "./interfaces/core.interfaces";
export declare function setupCore(opts: IPaginationOptions): {
    opts: IPaginationOptions;
    worker: IPaginationWorker;
};
