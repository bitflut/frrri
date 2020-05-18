import { ClassType } from '@lyxs/nest-crud/internal';
import { CrudEndpoint } from '../enums/crud-endpoint.enum';

export interface CrudDecoratorOptions {
    /** The endpoints you want to expose. Defaults to exposing all CRUD endpoints. */
    endpoints?: CrudEndpoint[];

    /** Query params for your controller */
    query?: { [key: string]: any };

    /** Dto used if not specified via `dtos.endpoint` */
    dto?: ClassType;

    /** Dtos used by endpoint */
    dtos?: {
        [CrudEndpoint.PostOne]?: ClassType;
        [CrudEndpoint.PutOne]?: ClassType;
        [CrudEndpoint.PatchOne]?: ClassType;
    };

    /** If provided, nest will convert the `id` to the provided primitive or ClassType */
    idType?: any;
}
