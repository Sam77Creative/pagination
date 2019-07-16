import { Observable } from "rxjs";
import { IPaginationOptions, IPaginationResponse } from "./interfaces/core.interfaces";
export declare const pagOpts: {
    wordpress: IPaginationOptions;
    shopify: IPaginationOptions;
};
export default function Pagination<T extends any>(url: string, opts: IPaginationOptions): Observable<IPaginationResponse<T>>;
