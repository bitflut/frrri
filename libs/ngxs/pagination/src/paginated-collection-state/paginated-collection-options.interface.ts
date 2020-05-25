import { CollectionOptions } from '@frrri/ngxs';

export interface PaginatedCollectionOptions<T> extends CollectionOptions<T> {
    size?: number;
}
