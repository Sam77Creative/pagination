import { last, reduce } from "rxjs/operators";
import { Pagination } from "./pagination";

function main() {
  const sub = Pagination<WordpressPost[]>("/example/wordpress", {
    headers: {
      accept: "application/json"
    }
  })
    .pipe(
      reduce((acc: any[], page: WordpressPost[]) => {
        return acc.concat(page);
      }, []),
      last()
    )
    .subscribe((res: WordpressPost[]) => {
      console.count("value");
      sub.unsubscribe();
    });
  console.log("Subscribed");
}

main();

interface WordpressPost {
  id: number;
}
