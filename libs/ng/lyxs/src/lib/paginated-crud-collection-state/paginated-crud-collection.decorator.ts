import { StateClass } from '@ngxs/store/internals';
import { CrudCollection, CrudCollectionOptions } from '../crud-collection-state/crud-collection.decorator';
import { CrudCollectionReducer } from '../crud-collection-state/crud-collection.state';

export interface PaginatedCrudCollectionOptions<T> extends CrudCollectionOptions<T> {
    size?: number;
}

export function PaginatedCrudCollection<T = CrudCollectionReducer>(options: PaginatedCrudCollectionOptions<T>) {
    options = {
        ...options,
        defaults: {
            next: {},
            ...options.defaults,
        },
    };

    const crudCollectionFn = CrudCollection(options);
    return function (target: StateClass) {
        target.prototype.pageSize = options.size;
        crudCollectionFn(target);
    };
}
