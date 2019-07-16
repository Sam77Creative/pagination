// Export the pagination function
import * as pag from "./pagination/pagination";
export const Pagination = pag.buildPagination();

// Export all of the interfaces
import * as interfaces from "./interfaces/core.interfaces";
export interface IPaginationOptions extends interfaces.IPaginationOptions {}
export interface IPaginationElement extends interfaces.IPaginationElement {}
export interface IPaginationHeaderLink
  extends interfaces.IPaginationHeaderLink {}
export interface IPaginationResponse<T>
  extends interfaces.IPaginationResponse<T> {}

// Import and build the pagOpts const
import { WordpressOpts } from "./services/wordpress";
import { ShopifyOpts } from "./services/shopify";

export const pagOpts = {
  wordpress: WordpressOpts,
  shopify: ShopifyOpts
};
