import { ClassType } from '@lyxs/nest-crud/internal';
import { Body, Param, UseInterceptors } from '@nestjs/common';
import { INTERCEPTORS_METADATA, METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { CrudEndpoint } from '../enums/crud-endpoint.enum';
import { CrudRequestInterceptor } from '../interceptors/crud-request.interceptor';
import { CrudDecoratorOptions } from '../interfaces/crud-decorator-options.interface';
import { endpointConfigurations } from './endpoint-configurations';
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

        // Prepend request interceptor
        const interceptors = Reflect.getMetadata(INTERCEPTORS_METADATA, target) || [];
        UseInterceptors(CrudRequestInterceptor, ...interceptors)(target);

        for (const endpoint of options.endpoints) {
            const config = endpointConfigurations[endpoint];

            // Add controller method
            target.prototype[endpoint] = config.factory(options);

            // Configure request
            Reflect.defineMetadata(PATH_METADATA, config.request.path, target.prototype[endpoint]);
            Reflect.defineMetadata(METHOD_METADATA, config.request.method, target.prototype[endpoint]);

            // Configure param decorators
            let parameterIndex = 0;
            ParsedRequest()(target.prototype, endpoint, parameterIndex);

            if (isIdRoute(endpoint)) {
                parameterIndex++;
                Param('id')(target.prototype, endpoint, parameterIndex);
            }

            if (isBodyRoute(endpoint)) {
                parameterIndex++;
                Body()(target.prototype, endpoint, parameterIndex);

                const dto = options?.dtos?.[endpoint] ?? options.dto;
                if (dto) {
                    const paramTypes = Array(parameterIndex);
                    paramTypes[parameterIndex] = dto;

                    Reflect.defineMetadata(
                        'design:paramtypes',
                        paramTypes,
                        target.prototype,
                        endpoint,
                    );
                }
            }
        }
    };
}
