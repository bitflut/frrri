import { CrudCollectionOptions } from './crud-collection-options.interface';

export interface CurdCollectionStateOptions {
    requestOptions: CrudCollectionOptions['requestOptions'];
    idKey?: string;
    baseUrl?: string;
    endpoint?: string;
    populateFactory: CrudCollectionOptions['requestOptions']['populateFactory'];
}
