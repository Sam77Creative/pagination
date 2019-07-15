"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = require("request");
var rxjs_1 = require("rxjs");
function Pagination(url, opts) {
    var _this = this;
    return rxjs_1.Observable.create(function (observer) { return __awaiter(_this, void 0, void 0, function () {
        var res;
        return __generator(this, function (_a) {
            res = createResponseObject(url, opts, observer);
            res.next();
            return [2];
        });
    }); });
}
exports.default = Pagination;
function createResponseObject(url, opts, observer) {
    var res = {
        error: null,
        page: getStartingPage(opts.startPage),
        payload: {},
        more: false,
        next: function () { },
        finish: function () {
            observer.complete();
            observer.unsubscribe();
        }
    };
    res.next = next(url, opts, res, observer);
    return res;
}
function next(url, opts, pagRes, observer) {
    var _this = this;
    var currentPage = pagRes.page;
    var prevHeaders = {};
    return function () { return __awaiter(_this, void 0, void 0, function () {
        var requestObj;
        return __generator(this, function (_a) {
            requestObj = getNextRequest(url, opts.page, currentPage, prevHeaders);
            request(requestObj, function (err, res, body) {
                if (err) {
                    throw err;
                }
                prevHeaders = res.headers;
                if (opts.type === "JSON") {
                    pagRes.payload = JSON.parse(body);
                }
                else {
                    throw new Error("type is not allowed");
                }
                pagRes.page = currentPage;
                if (opts.totalRecords) {
                    var newTotal = getTotalRecords(opts.totalRecords, res);
                    if (newTotal) {
                        pagRes.totalRecords = newTotal;
                    }
                }
                if (opts.totalPages) {
                    var newTotal = getTotalPages(opts.totalPages, res);
                    if (newTotal) {
                        pagRes.totalPages = newTotal;
                    }
                }
                observer.next(pagRes);
                ++currentPage;
                pagRes.more = hasMoreRecords(opts, pagRes, res);
                if (pagRes.more) {
                    pagRes.next();
                }
                else {
                    pagRes.finish();
                }
            });
            return [2];
        });
    }); };
}
function getNextRequest(url, page, currentPage, prevHeaders) {
    if (page.query) {
        return getPageByQuery(url, page.query, currentPage);
    }
    else if (page.header) {
        throw new Error("This case has not been created yet");
    }
    else if (page.headerLink) {
        return getPageByHeaderLink(url, page.headerLink, prevHeaders, currentPage);
    }
    else {
        throw new Error("page configuration needs to be defined");
    }
}
function hasMoreRecords(opts, pagRes, res) {
    if (pagRes.totalPages) {
        if (pagRes.page >= pagRes.totalPages) {
            return false;
        }
        else {
            return true;
        }
    }
    else if (pagRes.totalRecords) {
        if (opts.recordsPerPage * pagRes.page >= pagRes.totalRecords) {
            return false;
        }
        else {
            return true;
        }
    }
    else if (opts.page.headerLink) {
        var url = void 0;
        if (opts.page.headerLink.callback) {
            url = opts.page.headerLink.callback(res.headers[opts.page.headerLink.header]);
        }
        else {
            url = getPageByHeaderLink("", opts.page.headerLink, res.headers, 2);
        }
        if (url.url === "") {
            return false;
        }
        else {
            return true;
        }
    }
    else {
        throw new Error("No way to tell if there are more pages");
    }
}
function getTotalPages(totalPages, res) {
    if (totalPages.header) {
        if (res.headers[totalPages.header]) {
            return parseInt(res.headers[totalPages.header]);
        }
        else {
            return;
        }
    }
    else {
        throw new Error("totalPages configuration not supported");
    }
}
function getTotalRecords(totalRecords, res) {
    if (totalRecords.header) {
        if (res.headers[totalRecords.header]) {
            return parseInt(res.headers[totalRecords.header]);
        }
        else {
            return;
        }
    }
    else {
        throw new Error("totalRecords configuration not supported");
    }
}
function getPageByHeaderLink(url, page, prevHeaders, currentPage) {
    if (currentPage === 1) {
        return { url: url };
    }
    else {
        if (prevHeaders[page.header]) {
            var header = prevHeaders[page.header];
            if (page.callback) {
                return page.callback(header);
            }
            else {
                return parseHeaderLink(url, page, header);
            }
        }
        else {
            throw new Error("Current page is not 1 but header is not accessible.");
        }
    }
}
function parseHeaderLink(baseUrl, page, header) {
    var split = header.split(", ");
    var map = split.map(function (i) {
        return {
            url: i
                .split("; ")[0]
                .replace("<", "")
                .replace(">", ""),
            rel: i.split("rel=")[1].replace(/\"/g, "")
        };
    });
    var next = map.find(function (m) { return m.rel === "next"; });
    if (!next) {
        return { url: "" };
    }
    else {
        if (page.queryParam) {
            var param = getQueryParam(next.url, page.queryParam);
            return { url: baseUrl + "&" + page.queryParam + "=" + param };
        }
        else {
            return { url: next.url };
        }
    }
}
function getQueryParam(url, param) {
    var base = url.split(param + "=")[1];
    if (!base) {
        throw new Error("Invalid getQueryParam operation");
    }
    else {
        return base.split("&")[0];
    }
}
function getPageByQuery(url, attr, page) {
    return { url: url + "?" + attr + "=" + page };
}
function getStartingPage(page) {
    if (page) {
        return page;
    }
    else {
        return 1;
    }
}
