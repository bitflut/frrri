import { CrudCollectionReducer } from '@frrri/ngxs-crud';
import { HttpCrudCollection } from './http-crud-collection.decorator';
import { StateClass } from '@ngxs/store/internals';
import { PaginatedCrudCollectionOptions } from '@frrri/ngxs-crud/pagination';
import { HttpPaginatedCrudCollectionService } from './http-paginated-crud-collection.service';

export function HttpPaginatedCrudCollection<T = CrudCollectionReducer>(options: PaginatedCrudCollectionOptions<T>) {
    options = {
        ...options,
        defaults: {
            next: undefined,
            ...options.defaults,
        },
    };

    const crudCollectionFn = HttpCrudCollection(options);
    return function (target: StateClass) {
        target.prototype.pageSize = options.size;
        target.prototype.paginatedServiceToken = HttpPaginatedCrudCollectionService;
        crudCollectionFn(target);
    };
}
