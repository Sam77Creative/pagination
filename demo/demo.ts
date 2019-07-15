import { Observable } from "rxjs";
import { catchError, last, reduce, tap, find, filter } from "rxjs/operators";

import Pagination from "../src";
import { IPaginationResponse } from "../src/interfaces/core.interfaces";
import { wpUrl, wpOpts, IPayload, sUrl, sOpts } from "./constants";

function testShopify() {
  Pagination(sUrl + "?limit=2", sOpts)
    .pipe(
      reduce(
        (acc: any[], res: IPaginationResponse<any>) =>
          acc.concat(res.payload.products),
        []
      ),
      last()
    )
    .subscribe((bundle: any[]) => {
      console.log(`There are ${bundle.length} items in the bundle`);
    });
}

/**
 * This example retrieves every item from the paginated api.
 *  - We tap the observable to log out the current page as progress
 *  - We catch all errors into our custom handler
 *  - We reduce the incoming data array into a bundle of all data arrays
 *  - We wait until the observable completes to emit the bundle value
 */
function getAllItems() {
  Pagination(wpUrl, wpOpts)
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
      console.log(`There are ${bundle.length} items in this bundle`);
    });
}

getAllItems();

/**
 * This example retieves a specific item from the paginated list. The Observerable completes (so request stop) once the record has been found.
 *  - We check if it is in the current pages payload
 *  - We reduce the response to the single item we want
 *  - We log out the items name attribute
 * @param id number
 */
function findById(id: number) {
  Pagination(wpUrl, wpOpts)
    .pipe(
      find((res: IPaginationResponse<IPayload[]>) =>
        res.payload.find((i: IPayload) => i.id === id) ? true : false
      ),
      reduce((acc: IPayload, res: IPaginationResponse<IPayload[]>) => {
        return res.payload.find((i: IPayload) => i.id === id);
      })
    )
    .subscribe((val: IPayload) => {
      console.log(`Their name is ${val.name}`);
    });
}

/**
 * This example filters the entire paginated data by a 'type' attribute.
 *  - We filter the stream by checking if any items with this type exists in the payload
 *  - We reduce it by applying a filter on the incoming data
 *  - We log out the number of items in the filtered results
 * @param type string
 */
function filterByType(type: string) {
  Pagination(wpUrl, wpOpts)
    .pipe(
      filter((res: IPaginationResponse<any>) =>
        res.payload.find((p: any) => p.type === type) ? true : false
      ),
      reduce(
        (acc: any[], res: IPaginationResponse<any>) =>
          acc.concat(res.payload.filter((p: any) => p.type === type)),
        []
      ),
      last()
    )
    .subscribe((filteredData: any[]) => {
      console.log(`There are ${filteredData.length} items in this list`);
    });
}
