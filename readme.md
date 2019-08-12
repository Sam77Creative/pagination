# Pagination

Pagination makes paginated apis easy to work with. It returns an Observable that emits each page.

Given an IPaginationOptions element and a base url, easily grab records in a paginated style.

An example grabbing all of the posts from the Wordpress api.

```typescript
import Pagination from "@77io/pagination";
import { writeFileSync } from "fs";
import { last, reduce } from "rxjs/operators";

// Setup the basic options
const baseUrl = wordpressRoot + "/wp-json/wp/v2/posts";
const headers = {
  accept: "application/json"
};

const sub = Pagination(baseUrl, headers)
  .pipe(
    reduce((arr: any[], page: any[]) => {
      return arr.concat(page);
    }, []),
    last()
  )
  .subscribe((allPosts: any[]) => {
    console.log("I got all posts!");
    sub.unsubscribe();
  });
```

An example getting the first page from the Wordpress api.

```typescript
import Pagination from "@77io/pagination";
import { writeFileSync } from "fs";

// Setup the basic options
const baseUrl = wordpressRoot + "/wp-json/wp/v2/posts";
const headers = {
  accept: "application/json"
};

const sub = Pagination(baseUrl, headers).subscribe((posts: any[]) => {
  console.log("I got the first page of posts!");
  sub.unsubscribe();
});
```
