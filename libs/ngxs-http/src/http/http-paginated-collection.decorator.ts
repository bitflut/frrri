import { CollectionReducer } from '@frrri/ngxs';
import { HttpCollection } from './http-collection.decorator';
import { StateClass } from '@ngxs/store/internals';
import { PaginatedCollectionOptions } from '@frrri/ngxs/pagination';
import { HttpPaginatedCollectionService } from './http-paginated-collection.service';

export function HttpPaginatedCollection<T = CollectionReducer>(options: PaginatedCollectionOptions<T>) {
    options = {
        ...options,
        defaults: {
            next: undefined,
            ...options.defaults,
        },
    };

    const crudCollectionFn = HttpCollection(options);
    return function (target: StateClass) {
        target.prototype.pageSize = options.size;
        target.prototype.paginatedServiceToken = HttpPaginatedCollectionService;
        crudCollectionFn(target);
    };
}
