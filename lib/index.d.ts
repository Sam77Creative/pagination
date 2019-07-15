import { Observable } from "rxjs";
import { IPaginationOptions, IPaginationResponse } from "./interfaces/core.interfaces";
export default function Pagination<T extends any>(url: string, opts: IPaginationOptions): Observable<IPaginationResponse<T>>;
