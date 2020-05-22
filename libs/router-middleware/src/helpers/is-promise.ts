export function isPromise<T = any>(source: any): source is Promise<T> {
    return source && 'then' in source && typeof source.then === 'function';
}
