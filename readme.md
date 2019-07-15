# Pagination

Pagination makes paginated apis easy to work with. It returns an Observable that emits each page.

Given an IPaginationOptions element and a base url, easily grab records in a paginated style.

An example grabbing all of the posts from the Wordpress api.

```typescript
import Pagination from "@77io/pagination";
import { writeFileSync } from "fs";

// Setup the basic options
const baseUrl = wordpressRoot + "/wp-json/wp/v2/posts";
const opts = {
  totalRecords: {
    header: "x-wp-total"
  },
  totalPages: {
    header: "x-wp-totalpages"
  },
  page: {
    query: "page"
  }
};

Pagination(url, wpOpts)
  .pipe(
    tap((res: IPaginationResponse<IPayload[]>) =>
      console.log(`Page ${res.page}`)
    ),
    catchError(
      (err: Error, caught: Observable<IPaginationResponse<IPayload[]>>) => {
        console.log(err);
        return caught;
      }
    ),
    reduce(
      (acc: IPayload[], val: IPaginationResponse<IPayload[]>) =>
        acc.concat(val.payload),
      []
    ),
    last()
  )
  .subscribe((bundle: IPayload[]) => {
    console.log(bundle.length);
  });
```

View /demo/demo.ts for more examples.
