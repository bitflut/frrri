import { ClassType } from '@lyxs/nest-crud/internal';
import { CrudEndpoint } from '../enums/crud-endpoint.enum';

interface DefaultOptions {
    endpoint: CrudEndpoint;
    query?: { [key: string]: any };
}

interface GetManyOptions extends DefaultOptions {
    endpoint: CrudEndpoint.GetMany;
}

interface GetOneOptions extends DefaultOptions {
    endpoint: CrudEndpoint.GetOne;
    idType?: any;
}

interface PatchOneOptions extends DefaultOptions {
    endpoint: CrudEndpoint.PatchOne;
    idType?: any;
    dto?: ClassType;
}

interface PutOneOptions extends DefaultOptions {
    endpoint: CrudEndpoint.PutOne;
    idType?: any;
    dto?: ClassType;
}

interface PostOneOptions extends DefaultOptions {
    endpoint: CrudEndpoint.PostOne;
    idType?: any;
    dto?: ClassType;
}

export type CrudEndpointOptions =
    DefaultOptions
    | GetManyOptions
    | GetOneOptions
    | PatchOneOptions
    | PutOneOptions
    | PostOneOptions;
