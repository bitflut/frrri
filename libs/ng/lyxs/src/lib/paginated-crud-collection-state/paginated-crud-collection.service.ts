import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { EMPTY, Observable } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';
import { GetManyOptions } from '../crud-collection-state/crud-collection.state';

export interface Paginated<T> {
    pagination: {
        data: T,
        next: any,
        nextUrl: string,
    };
}

@Injectable({
    providedIn: 'root',
})
export class PaginatedCrudCollectionService<V> {

    protected http = this.injector.get(HttpClient);

    constructor(protected injector: Injector) { }

    getMany(url: string, options: GetManyOptions & { size?: number } = {}) {
        return this.http.get<Paginated<V[]>>(url, { params: options.params });
    }

    /**
     * private async getAllPages(firstPage: any[]) {
     *     const data = [...firstPage];
     *     let hasNext = await this.service.next$.pipe(take(1)).toPromise();
     *     while (hasNext) {
     *         const nextRequest = await this.service.getNext();
     *         const newData = await nextRequest.toPromise();
     *         data.push(...newData);
     *         hasNext = await this.service.next$.pipe(take(1)).toPromise();
     *     }
     *     return data;
     * }
     */

    getAll(url: string, options: GetManyOptions & { size?: number } = {}): Observable<V[]> {
        return this.getMany(url, options).pipe(
            expand(response => {
                let nextUrl = response.pagination?.nextUrl;
                if (!nextUrl) { return EMPTY; }

                const isUrlWith = nextUrl.startsWith('http');
                if (!isUrlWith) {
                    const baseUrl = url.match(/^(https?:\/\/[^\/]+)\//)[1];
                    nextUrl = `${baseUrl}${nextUrl}`;
                }

                return this.getMany(nextUrl);
            }),
            reduce((acc, res) => {
                return [
                    ...acc,
                    ...res.pagination.data,
                ];
            }, [] as V[]),
        );
    }

    getNext(url: string, next: any) {
        return this.http.get<Paginated<V[]>>(url, {
            params: next,
        });
    }

}
