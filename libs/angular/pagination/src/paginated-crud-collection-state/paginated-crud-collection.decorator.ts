import { CrudCollection, CrudCollectionOptions, CrudCollectionReducer } from '@lyxs/angular';
import { StateClass } from '@ngxs/store/internals';

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