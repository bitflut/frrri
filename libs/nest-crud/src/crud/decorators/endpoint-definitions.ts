import { RequestMethod } from '@nestjs/common';
import { CrudEndpoint } from '../enums/crud-endpoint.enum';
import { EndpointConfig } from '../interfaces/crud-endpoint-config.interface';
import { EndpointDefinition } from '../interfaces/endpoint-definition.interface';
import { ParsedRequest } from '../interfaces/parsed-request.interface';

function endpointFactory(config: EndpointConfig) {
    return function (req: ParsedRequest, ...args: any) {
        if (!req) {
            throw new Error(`Provide \`ParsedRequest\` as first argument to \`${config.endpoint}()\``);
        }

        req.query = {
            ...req.query,
            ...config.query,
        };

        return this.service[config.endpoint](req, ...args);
    };
}

const defaultFactory = (config: EndpointConfig) => endpointFactory(config);

export const endpointDefinitions: { [key in CrudEndpoint]: EndpointDefinition } = {
    [CrudEndpoint.GetMany]: {
        request: {
            method: RequestMethod.GET,
            path: '',
        },
        factory: defaultFactory,
    },
    [CrudEndpoint.GetOne]: {
        request: {
            method: RequestMethod.GET,
            path: ':id',
        },
        factory: defaultFactory,
    },
    [CrudEndpoint.DeleteOne]: {
        request: {
            method: RequestMethod.DELETE,
            path: ':id',
        },
        factory: defaultFactory,
    },
    [CrudEndpoint.PatchOne]: {
        request: {
            method: RequestMethod.PATCH,
            path: ':id',
        },
        factory: defaultFactory,
    },
    [CrudEndpoint.PostOne]: {
        request: {
            method: RequestMethod.POST,
            path: '',
        },
        factory: defaultFactory,
    },
    [CrudEndpoint.PutOne]: {
        request: {
            method: RequestMethod.PUT,
            path: ':id',
        },
        factory: defaultFactory,
    },
};
