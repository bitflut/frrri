import { HttpClient } from '@angular/common/http';
import { Injectable, Injector, InjectionToken } from '@angular/core';
import { GetManyOptions } from '@lyxs/ngxs-crud/internal';
import { PaginatedCrudCollectionService, Paginated } from '@lyxs/ngxs-crud/pagination';
import { EMPTY, Observable } from 'rxjs';
import { expand, reduce } from 'rxjs/operators';
import { CurdCollectionStateOptions } from '@lyxs/ngxs-crud';
import { HttpCrudCollectionService } from './http-crud-collection.service';

@Injectable({
    providedIn: 'root',
})
export class PaginatedHttpCrudCollectionService implements PaginatedCrudCollectionService {

    protected http = this.injector.get(HttpClient);

    constructor(protected injector: Injector) { }

    getMany<V>(stateOptions: CurdCollectionStateOptions, options: GetManyOptions & { size?: number } = {}) {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.get<Paginated<V[]>>(url, { params: options.params });
    }

    getAll<V>(stateOptions: CurdCollectionStateOptions, options: GetManyOptions & { size?: number } = {}): Observable<V[]> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.getManyWithUrl<V>(url, options).pipe(
            expand(response => {
                let next = response.pagination?.next;
                if (!next) { return EMPTY; }

                const isUrlWith = next.startsWith('http');
                if (!isUrlWith) {
                    const baseUrl = url.match(/^(https?:\/\/[^\/]+)\//)[1];
                    next = `${baseUrl}${next}`;
                }

                return this.getManyWithUrl<V>(next);
            }),
            reduce((acc, res) => {
                return [
                    ...acc,
                    ...res.pagination.data,
                ];
            }, [] as V[]),
        );
    }

    getNext<V>(url: any) {
        return this.http.get<Paginated<V[]>>(url);
    }

    private getManyWithUrl<V>(url: string, options: GetManyOptions & { size?: number } = {}) {
        return this.http.get<Paginated<V[]>>(url, { params: options.params });
    }

}
