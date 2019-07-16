export declare const Pagination: <T extends any>(url: string, opts: interfaces.IPaginationOptions) => import("rxjs").Observable<interfaces.IPaginationResponse<T>>;
import * as interfaces from "./interfaces/core.interfaces";
export interface IPaginationOptions extends interfaces.IPaginationOptions {
}
export interface IPaginationElement extends interfaces.IPaginationElement {
}
export interface IPaginationHeaderLink extends interfaces.IPaginationHeaderLink {
}
export interface IPaginationResponse<T> extends interfaces.IPaginationResponse<T> {
}
export declare const pagOpts: {
    wordpress: interfaces.IPaginationOptions;
    shopify: interfaces.IPaginationOptions;
};
