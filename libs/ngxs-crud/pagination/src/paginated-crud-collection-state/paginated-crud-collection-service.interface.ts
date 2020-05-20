import { GetManyOptions } from '@frrri/ngxs-crud/internal';
import { Observable } from 'rxjs';
import { CurdCollectionStateOptions } from '@frrri/ngxs-crud';

export interface PaginatedCrudCollectionService<V = any> {
    getMany(stateOptions: CurdCollectionStateOptions, options: GetManyOptions & { size?: number });
    getAll(stateOptions: CurdCollectionStateOptions, options: GetManyOptions & { size?: number }): Observable<V[]>;
    getNext(url: string);
}

export interface Paginated<T = {}> {
    pagination: {
        data: T,
        next: string,
    };
}

