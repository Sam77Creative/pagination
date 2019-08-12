import { Pagination } from "./pagination";

function main() {
  const sub = Pagination("https://example/wordpress", {
    headers: {
      accept: "application/json"
    }
  }).subscribe((res: any) => {
    console.count("value");
    sub.unsubscribe();
  });
  console.log("Subscribed");
}

main();
