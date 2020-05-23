export interface StateRegistry<T = any> {
    getByPath<V = T>(path: string): V;
}
