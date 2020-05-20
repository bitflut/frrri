import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { GetManyOptions } from '@frrri/ngxs-crud/internal';
import { Observable } from 'rxjs';
import { CrudCollectionService, CurdCollectionStateOptions } from '@frrri/ngxs-crud';

@Injectable({
    providedIn: 'root',
})
export class HttpCrudCollectionService implements CrudCollectionService {

    protected http = this.injector.get(HttpClient);

    constructor(protected injector: Injector) { }

    getOne<V, IdType>(stateOptions: CurdCollectionStateOptions, id: IdType) {
        const url = stateOptions.requestOptions.resourceUrlFactory(id);
        return this.http.get<V>(url);
    }

    getMany<V>(stateOptions: CurdCollectionStateOptions, options: GetManyOptions = {}): Observable<V[]> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.get<V[]>(url, { params: options.params });
    }

    patchOne<V, IdType>(stateOptions: CurdCollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }) {
        const url = stateOptions.requestOptions.resourceUrlFactory(id);
        return this.http.patch<V>(url, changes);
    }

    putOne<V, IdType>(stateOptions: CurdCollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.put<V>(url, changes);
    }

    deleteOne<IdType>(stateOptions: CurdCollectionStateOptions, id: IdType) {
        const url = stateOptions.requestOptions.resourceUrlFactory(id);
        return this.http.delete<void>(url);
    }

    postOne<V>(stateOptions: CurdCollectionStateOptions, body: Partial<V>): Observable<V> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.post<V>(
            url,
            body,
        );
    }

}
