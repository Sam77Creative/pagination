"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var operators_1 = require("rxjs/operators");
var pagination_1 = require("./pagination");
function main() {
    var sub = pagination_1.Pagination("/example/wordpress", {
        headers: {
            accept: "application/json"
        }
    })
        .pipe(operators_1.reduce(function (acc, page) {
        return acc.concat(page);
    }, []), operators_1.last())
        .subscribe(function (res) {
        console.count("value");
        sub.unsubscribe();
    });
    console.log("Subscribed");
}
main();
