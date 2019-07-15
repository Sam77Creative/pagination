import { IPaginationOptions, IPaginationResponse } from "./interfaces/core.interfaces";
import { Observable } from "rxjs";
export default abstract class Pagination {
    static of<T extends any>(url: string, incomingOpts: IPaginationOptions): Observable<IPaginationResponse<T>>;
    static bundle<T extends any>(url: string, incomingOpts: IPaginationOptions): Promise<T[]>;
}
