import { METHOD_METADATA, PATH_METADATA } from '@nestjs/common/constants';
import { endpointDefinitions } from './endpoint-definitions';
import { CrudEndpoint } from './enums/crud-endpoint.enum';
import { validateController } from './helpers/validate-controller';
import { validateService } from './helpers/validate-service';
import { ClassType } from './interfaces/class.interface';
import { CrudDecoratorOptions } from './interfaces/crud-decorator-options.interface';

export function Crud(options: CrudDecoratorOptions = {}) {
    return function (target: ClassType) {
        options = {
            endpoints: Object.values(CrudEndpoint),
            ...options,
        };

        validateController(target);
        validateService(target.prototype.service, options.endpoints);

        for (const endpoint of options.endpoints) {
            const definition = endpointDefinitions[endpoint];

            target.prototype[endpoint] = definition.factory(options);
            Reflect.defineMetadata(PATH_METADATA, definition.request.path, target.prototype[endpoint]);
            Reflect.defineMetadata(METHOD_METADATA, definition.request.method, target.prototype[endpoint]);
        }
    };
}
