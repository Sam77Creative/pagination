"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setupCore(opts) {
    var worker = {
        currentPage: opts.start ? opts.start : 1
    };
    return { opts: opts, worker: worker };
}
exports.setupCore = setupCore;
