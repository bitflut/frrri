export interface ParsedRequest<Request = any, Response = any> {
    query: { [key: string]: any };
    request: Request;
    response: Response;
    [key: string]: any;
}
