import { CrudCollectionOptions, CrudCollectionReducer } from '@lyxs/ngxs-crud';
import { StateClass } from '@ngxs/store/internals';
import { HttpCrudCollection } from './http-crud-collection.decorator';
import { PAGINATED_HTTP_CRUD_COLLECTION_SERVICE } from './http-crud-collection.module';

export interface PaginatedHttpCrudCollectionOptions<T> extends CrudCollectionOptions<T> {
    size?: number;
}

export function PaginatedHttpCrudCollection<T = CrudCollectionReducer>(options: PaginatedHttpCrudCollectionOptions<T>) {
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
