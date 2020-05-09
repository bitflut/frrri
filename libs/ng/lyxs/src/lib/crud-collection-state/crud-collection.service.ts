import { HttpClient } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { EntityIdType } from '@ngxs-labs/data/typings';
import { Observable } from 'rxjs';

export interface GetManyOptions {
    [key: string]: any;
    params?: { [key: string]: string | string[] };
}

@Injectable({
    providedIn: 'root',
})
export class CrudCollectionService<V, K extends EntityIdType = EntityIdType> {

    protected http = this.injector.get(HttpClient);

    constructor(protected injector: Injector) { }

    getOne(url: string) {
        return this.http.get<V>(url);
    }

    getMany(url: string, options: GetManyOptions = {}): Observable<V[]> {
        return this.http.get<V[]>(url, { params: options.params });
    }

    patchOne(url: string, changes: { [key: string]: Partial<V> }) {
        return this.http.patch<V>(url, changes);
    }

    putOne(url: string, changes: { [key: string]: Partial<V> }) {
        return this.http.put<V>(url, changes);
    }

    deleteOne(url: string) {
        return this.http.delete<void>(url);
    }

    postOne(url: string, body: Partial<V>) {
        return this.http.post<V>(
            url,
            body,
        );
    }

}
