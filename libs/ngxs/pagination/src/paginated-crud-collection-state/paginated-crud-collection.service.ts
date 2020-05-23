import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { GetManyOptions } from '@frrri/ngxs/internal';
import { EMPTY, Observable } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';

export interface Paginated<T = {}> {
    pagination: {
        data: T,
        next: string,
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

    getAll(url: string, options: GetManyOptions & { size?: number } = {}): Observable<V[]> {
        return this.getMany(url, options).pipe(
            expand(response => {
                let next = response.pagination?.next;
                if (!next) { return EMPTY; }

                const isUrlWith = next.startsWith('http');
                if (!isUrlWith) {
                    const baseUrl = url.match(/^(https?:\/\/[^\/]+)\//)[1];
                    next = `${baseUrl}${next}`;
                }

                return this.getMany(next);
            }),
            reduce((acc, res) => {
                return [
                    ...acc,
                    ...res.pagination.data,
                ];
            }, [] as V[]),
        );
    }

    getNext(url: any) {
        return this.http.get<Paginated<V[]>>(url);
    }

}
