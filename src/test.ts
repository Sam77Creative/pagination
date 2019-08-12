import { last, reduce } from "rxjs/operators";
import { Pagination } from "./pagination";

function main() {
  const sub = Pagination("/example/wordpress", {
    headers: {
      accept: "application/json"
    }
  })
    .pipe(
      reduce((acc: any[], page: any) => {
        return acc.concat(page);
      }, []),
      last()
    )
    .subscribe((res: any) => {
      console.count("value");
      sub.unsubscribe();
    });
  console.log("Subscribed");
}

main();
