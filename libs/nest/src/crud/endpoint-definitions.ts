import { RequestMethod } from '@nestjs/common';
import { CrudEndpoint } from './enums/crud-endpoint.enum';
import { CrudDecoratorOptions } from './interfaces/crud-decorator-options.interface';
import { EndpointDefinition } from './interfaces/endpoint-definition.interface';

function endpointFactory(method: CrudEndpoint, options: CrudDecoratorOptions) {
    return function (req: any) {
        req.condition = {
            ...req.condition,
            ...options.conditions,
        };

        return this.service[method](req);
    };
}

export const endpointDefinitions: { [key in CrudEndpoint]: EndpointDefinition } = {
    [CrudEndpoint.GetMany]: {
        request: {
            method: RequestMethod.GET,
            path: '',
        },
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.GetMany, options),
    },
    [CrudEndpoint.GetOne]: {
        request: {
            method: RequestMethod.GET,
            path: ':id',
        },
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.GetMany, options),
    },
    [CrudEndpoint.DeleteOne]: {
        request: {
            method: RequestMethod.DELETE,
            path: ':id',
        },
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.GetMany, options),
    },
    [CrudEndpoint.PatchOne]: {
        request: {
            method: RequestMethod.PATCH,
            path: ':id',
        },
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.GetMany, options),
    },
    [CrudEndpoint.PostOne]: {
        request: {
            method: RequestMethod.POST,
            path: '',
        },
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.GetMany, options),
    },
    [CrudEndpoint.PutOne]: {
        request: {
            method: RequestMethod.PUT,
            path: ':id',
        },
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.GetMany, options),
    },
};
