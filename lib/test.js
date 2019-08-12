"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pagination_1 = require("./pagination");
function main() {
    var sub = pagination_1.Pagination("https://example/wordpress", {
        headers: {
            accept: "application/json"
        }
    }).subscribe(function (res) {
        console.count("value");
        sub.unsubscribe();
    });
    console.log("Subscribed");
}
main();
