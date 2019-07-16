"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pag = require("./pagination/pagination");
exports.Pagination = pag.buildPagination();
var wordpress_1 = require("./services/wordpress");
var shopify_1 = require("./services/shopify");
exports.pagOpts = {
    wordpress: wordpress_1.WordpressOpts,
    shopify: shopify_1.ShopifyOpts
};
