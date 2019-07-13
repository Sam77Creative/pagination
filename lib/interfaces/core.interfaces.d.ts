export interface IPaginationOptions {
    start?: number;
    page: IPaginationElement;
    totalRecords: IPaginationElement;
    totalPages: IPaginationElement;
}
export interface IPaginationElement {
    header?: string;
    query?: string;
}
export interface IPaginationWorker {
    currentPage: number;
}
export interface IPaginationResponse<T> {
    page: number;
    totalRecords: number;
    payload: T | undefined;
    error: Error | null;
    finish: Function;
    next: Function;
    more: boolean;
    recordsPerPage: number;
}
