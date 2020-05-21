import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { GetManyOptions } from '@frrri/ngxs-crud/internal';
import { PaginatedCrudCollectionService, Paginated } from '@frrri/ngxs-crud/pagination';
import { EMPTY, Observable } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';
import { CurdCollectionStateOptions } from '@frrri/ngxs-crud';

@Injectable({
    providedIn: 'root',
})
export class HttpPaginatedCrudCollectionService<V = any> implements PaginatedCrudCollectionService<V> {

    protected http = this.injector.get(HttpClient);

    constructor(protected injector: Injector) { }

    getMany(stateOptions: CurdCollectionStateOptions, options: GetManyOptions & { size?: number } = {}) {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.get<Paginated<V[]>>(url, { params: options.params });
    }

    getAll(stateOptions: CurdCollectionStateOptions, options: GetManyOptions & { size?: number } = {}): Observable<V[]> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.getManyWithUrl(url, options).pipe(
            expand(response => {
                let next = response.pagination?.next;
                if (!next) { return EMPTY; }

                const isUrlWith = next.startsWith('http');
                if (!isUrlWith) {
                    const baseUrl = url.match(/^(https?:\/\/[^\/]+)\//)[1];
                    next = `${baseUrl}${next}`;
                }

                return this.getManyWithUrl(next);
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

    private getManyWithUrl(url: string, options: GetManyOptions & { size?: number } = {}): Observable<Paginated<V[]>> {
        return this.http.get<Paginated<V[]>>(url, { params: options.params });
    }

}
