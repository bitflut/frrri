import { Observable } from 'rxjs';
import { GetManyOptions } from '@frrri/ngxs/internal';
import { CollectionStateOptions } from '@frrri/ngxs';

export interface PaginatedCollectionService<V = any> {
    getMany(stateOptions: CollectionStateOptions, options: GetManyOptions & { size?: number });
    getAll(stateOptions: CollectionStateOptions, options: GetManyOptions & { size?: number }): Observable<V[]>;
    getNext(url: string);
}

export interface Paginated<T = {}> {
    pagination: {
        data: T,
        next: string,
    };
}

