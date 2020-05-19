import { ClassType } from '@lyxs/nest-crud/internal';
import { Body, Param, UseInterceptors } from '@nestjs/common';
import { INTERCEPTORS_METADATA, METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { pick } from 'lodash';
import { CrudEndpoint } from '../enums/crud-endpoint.enum';
import { CrudRequestInterceptor } from '../interceptors/crud-request.interceptor';
import { CrudDecoratorOptions } from '../interfaces/crud-decorator-options.interface';
import { EndpointConfig } from '../interfaces/crud-endpoint-config.interface';
import { endpointDefinitions } from './endpoint-definitions';
import { ParsedRequest } from './parsed-request.decorator';

function isIdRoute(endpoint: CrudEndpoint) {
    return ![CrudEndpoint.GetMany, CrudEndpoint.PostOne].includes(endpoint);
}

function isBodyRoute(endpoint: CrudEndpoint) {
    return [CrudEndpoint.PatchOne, CrudEndpoint.PostOne, CrudEndpoint.PutOne].includes(endpoint);
}

export function Crud(options: CrudDecoratorOptions = {}) {
    return function (target: ClassType) {
        options = {
            endpoints: Object.values(CrudEndpoint),
            ...options,
        };

        // Prepend CrudRequestInterceptor
        const interceptors = Reflect.getMetadata(INTERCEPTORS_METADATA, target) || [];
        UseInterceptors(CrudRequestInterceptor, ...interceptors)(target);

        const endpointConfigs = options.endpoints.reduce((prev, curr) => {
            const endpoint = typeof curr === 'object' ? curr.endpoint : curr;
            prev[endpoint] = {
                endpoint,
                ...endpointDefinitions[endpoint],
                ...pick(options, 'query', 'idType', 'dto'),
                ...typeof curr === 'object' ? curr : {},
            };
            return prev;
        }, {} as { [key in CrudEndpoint]: EndpointConfig });

        for (const config of Object.values(endpointConfigs)) {
            // Add controller method
            target.prototype[config.endpoint] = config.factory(config);
            configureRequest(config, target);
            configureParams(config, target);
        }
    };

    /**
     * Add nest request decorator
     * ```typescript
     * \@Get(':id')
     * ```
     */
    function configureRequest(config: EndpointConfig, target: ClassType) {
        Reflect.defineMetadata(PATH_METADATA, config.request.path, target.prototype[config.endpoint]);
        Reflect.defineMetadata(METHOD_METADATA, config.request.method, target.prototype[config.endpoint]);
    }

    /**
     * Add nest method param decorators
     * ```typescript
     * patchOne(
     *     \@ParsedRequest() req: any,
     *     \@Param('id') id: IdType,
     *     \@Body() body: Dto,
     * ) {}
     * ```
     */
    function configureParams(config: EndpointConfig, target: ClassType) {
        const paramTypes = [];
        let parameterIndex = 0;
        ParsedRequest()(target.prototype, config.endpoint, parameterIndex);

        if (isIdRoute(config.endpoint)) {
            parameterIndex++;
            Param('id')(target.prototype, config.endpoint, parameterIndex);

            if ('idType' in config) {
                paramTypes[parameterIndex] = config.idType;
            }
        }

        if (isBodyRoute(config.endpoint)) {
            parameterIndex++;
            Body()(target.prototype, config.endpoint, parameterIndex);

            if ('dto' in config) {
                paramTypes[parameterIndex] = config.dto;
            }
        }

        // Add paramtypes to endpoint for validation
        Reflect.defineMetadata('design:paramtypes', paramTypes, target.prototype, config.endpoint);
    }
}
