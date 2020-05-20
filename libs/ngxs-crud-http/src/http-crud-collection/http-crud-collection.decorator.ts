import { StateRepository } from '@ngxs-labs/data/decorators';
import { createEntityCollections } from '@ngxs-labs/data/utils';
import { State } from '@ngxs/store';
import { StateClass } from '@ngxs/store/internals';
import { CrudCollectionReducer, CrudCollectionOptions, CurdCollectionStateOptions } from '@frrri/ngxs-crud';
import { HTTP_CRUD_COLLECTION_SERVICE } from './http-crud-collection.module';

export function HttpCrudCollection<T = CrudCollectionReducer>(options: CrudCollectionOptions<T>) {
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
        target.prototype.serviceToken = HTTP_CRUD_COLLECTION_SERVICE;

        const stateOptions = {
            requestOptions: options.requestOptions,
            endpoint: options.endpoint!,
            baseUrl: options.baseUrl!,
        } as CurdCollectionStateOptions;
        if (options.idKey) {
            stateOptions.idKey = options.idKey!;
        }
        target.prototype.stateOptions = stateOptions;
        // todo: compose them to an options object
        // target.prototype.requestOptions = options.requestOptions;
        // target.prototype.endpoint = options.endpoint!;
        // target.prototype.baseUrl = options.baseUrl!;
        // if (options.idKey) {
        //     target.prototype.idKey = options.idKey!;
        // }
    };
}
