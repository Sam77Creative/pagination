import { IPaginationOptions, IPaginationResponse } from "./interfaces/core.interfaces";
import { Observable } from "rxjs";
export default function Pagination<T extends any>(url: string, incomingOpts: IPaginationOptions): Observable<IPaginationResponse<T>>;
