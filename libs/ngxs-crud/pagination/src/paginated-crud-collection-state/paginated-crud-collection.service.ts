import { GetManyOptions } from '@lyxs/ngxs-crud/internal';
import { Observable } from 'rxjs';
import { CurdCollectionStateOptions } from '@lyxs/ngxs-crud';

export interface PaginatedCrudCollectionService {
    getMany<V>(stateOptions: CurdCollectionStateOptions, options: GetManyOptions & { size?: number });
    getAll<V>(stateOptions: CurdCollectionStateOptions, options: GetManyOptions & { size?: number }): Observable<V[]>;
    getNext<V>(url: string);
}

export interface Paginated<T = {}> {
    pagination: {
        data: T,
        next: string,
    };
}

