import * as request from "request";
import { Subject } from "rxjs";
export declare function BuildPagination(): <T extends any>(url: string, headers?: request.Headers | undefined) => Subject<unknown>;
