import { Observable } from "rxjs";
import { catchError, last, reduce, tap, find } from "rxjs/operators";

import Pagination from "../src";
import { IPaginationResponse } from "../src/interfaces/core.interfaces";
import { url, wpOpts, IPayload } from "./constants";

/**
 * This example retrieves every item from the paginated api.
 *  - We tap the observable to log out the current page as progress
 *  - We catch all errors into our custom handler
 *  - We reduce the incoming data array into a bundle of all data arrays
 *  - We wait until the observable completes to emit the bundle value
 */
function getAllItems() {
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
          val.payload ? acc.concat(val.payload) : acc,
        []
      ),
      last()
    )
    .subscribe((bundle: IPayload[]) => {
      console.log(bundle.length);
    });
}

/**
 * This example retieves a specific item from the paginated list. The Observerable completes (so request stop) once the record has been found.
 *  - We check if it is in the current pages payload
 *  - We reduce the response to the single item we want
 *  - We log out the items name attribute
 * @param id number
 */
function findById(id: number) {
  Pagination(url, wpOpts)
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
