export interface IHTTPResponse<T> {
    data: T;
    status: string;
    message: string;
}