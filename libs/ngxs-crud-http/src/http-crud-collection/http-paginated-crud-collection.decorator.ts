import { CrudCollectionOptions, CrudCollectionReducer } from '@frrri/ngxs-crud';
import { HttpCrudCollection } from './http-crud-collection.decorator';
import { PAGINATED_HTTP_CRUD_COLLECTION_SERVICE } from './http-crud-collection.module';
import { StateClass } from '@ngxs/store/internals';
import { PaginatedCrudCollectionOptions } from '@frrri/ngxs-crud/pagination';

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
        target.prototype.paginatedServiceToken = PAGINATED_HTTP_CRUD_COLLECTION_SERVICE;
        crudCollectionFn(target);
    };
}
