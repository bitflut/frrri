import { StateRepository } from '@ngxs-labs/data/decorators';
import { EntityIdType } from '@ngxs-labs/data/typings/public_api';
import { createEntityCollections } from '@ngxs-labs/data/utils';
import { State } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { StoreOptions } from '@ngxs/store/src/symbols';
import { CrudCollectionReducer } from './crud-collection.state';

interface CrudCollectionRequestOptions<IdType = EntityIdType> {
    delay?: number;
    timeout?: number;
    /**
     * Defaults to `() => \`${baseUrl}/${endpoint}\``
     */
    collectionUrlFactory?: () => string;
    /**
     * Defaults to `id => \`${baseUrl}/${endpoint}/${id}\``
     */
    resourceUrlFactory?: (id: IdType) => string;
    /**
     * Used to add query params when populating
     */
    populateFactory?: (ids: IdType[], path: string) => { [key: string]: string | string[] };
}

export interface CrudCollectionOptions<T = any> extends StoreOptions<T> {
    // Defaults to `/api`
    baseUrl?: string;
    // Defaults to `CrudCollection.name`
    endpoint?: string;
    // Defaults to `id`
    idKey?: string;
    requestOptions?: CrudCollectionRequestOptions<T>;
}

export function CrudCollection<T = CrudCollectionReducer>(options: CrudCollectionOptions<T>) {
    options = {
        ...options,
        baseUrl: options.baseUrl ?? '/api',
        endpoint: options.endpoint ?? options.name.toString(),
        defaults: {
            ...createEntityCollections(),
            active: undefined,
            loaded: false,
            loading: {},
            error: {},
            ...options.defaults,
        },
    } as CrudCollectionOptions<T>;

    const stateFn = State(options);
    const stateRepositoryFn = StateRepository();
    return function (target: StateClass) {
        stateFn(target);
        stateRepositoryFn(target);
        target.prototype.requestOptions = options.requestOptions;
        target.prototype.endpoint = options.endpoint!;
        target.prototype.baseUrl = options.baseUrl!;
        if (options.idKey) {
            target.prototype.idKey = options.idKey!;
        }
    };
}
