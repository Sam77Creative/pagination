import { IPaginationOptions, IPaginationResponse } from "../interfaces/core.interfaces";
import { Observable } from "rxjs";
export declare function buildPagination(): <T extends any>(url: string, opts: IPaginationOptions) => Observable<IPaginationResponse<T>>;
