import { RequestMethod } from '@nestjs/common';
import { CrudEndpoint } from '../enums/crud-endpoint.enum';
import { CrudDecoratorOptions } from '../interfaces/crud-decorator-options.interface';
import { EndpointDefinition } from '../interfaces/endpoint-definition.interface';
import { ParsedRequest } from '../interfaces/parsed-request.interface';

function endpointFactory(method: CrudEndpoint, options: CrudDecoratorOptions) {
    return function (req: ParsedRequest, ...args: any) {
        if (!req) {
            throw new Error(`Provide \`ParsedRequest\` as first argument to \`${method}()\``);
        }

        req.query = {
            ...req.query,
            ...options.query,
        };

        return this.service[method](req, ...args);
    };
}

export const endpointConfigurations: { [key in CrudEndpoint]: EndpointDefinition } = {
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
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.GetOne, options),
    },
    [CrudEndpoint.DeleteOne]: {
        request: {
            method: RequestMethod.DELETE,
            path: ':id',
        },
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.DeleteOne, options),
    },
    [CrudEndpoint.PatchOne]: {
        request: {
            method: RequestMethod.PATCH,
            path: ':id',
        },
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.PatchOne, options),
    },
    [CrudEndpoint.PostOne]: {
        request: {
            method: RequestMethod.POST,
            path: '',
        },
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.PostOne, options),
    },
    [CrudEndpoint.PutOne]: {
        request: {
            method: RequestMethod.PUT,
            path: ':id',
        },
        factory: (options: CrudDecoratorOptions) => endpointFactory(CrudEndpoint.PutOne, options),
    },
};
