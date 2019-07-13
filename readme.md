# Pagination

Pagination makes paginated apis easy to work with.

Given an IPaginationOptions element and a base url, easily grab records in a paginated style.

An example grabbing all of the posts from the Wordpress api.

```typescript
import Pagination from "pagination";
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

// A bundle to save the data
let bundle = [];

Pagination(baseUrl, opts).subscribe((res: IPaginationResponse<any>) => {
  console.log(`This is page ${res.page}.`);

  bundle = bundle.concat(res.payload);

  if (res.more) {
    res.next();
  } else {
    res.finish();
    console.log(`Finished with ${res.totalRecords} records.`);

    // Write to a local file
    writeFileSync("example.json", JSON.stringify(bundle));
  }
});
```

View /demo/demo.ts for a more complete example.
