import { CrudCollectionOptions } from '@frrri/ngxs-crud';

export interface PaginatedCrudCollectionOptions<T> extends CrudCollectionOptions<T> {
    size?: number;
}
