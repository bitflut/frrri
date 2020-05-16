export interface CrudResponse<T> {
    data: T;
    status: number;
    statusText: string;
    headers: any;
}
