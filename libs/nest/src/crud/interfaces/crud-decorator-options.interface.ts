import { CrudEndpoint } from '../enums/crud-endpoint.enum';

export interface CrudDecoratorOptions {
    /** The endpoints you want to expose. Defaults to exposing all CRUD endpoints. */
    endpoints?: CrudEndpoint[];

    /** Static conditions for your controller */
    conditions?: { [key: string]: any };
}
