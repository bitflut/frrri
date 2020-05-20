import { GetManyOptions } from '@frrri/ngxs-crud/internal';
import { Observable } from 'rxjs';
import { CurdCollectionStateOptions } from '@frrri/ngxs-crud';

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

