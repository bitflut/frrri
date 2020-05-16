import { CrudEndpoint } from '../enums/crud-endpoint.enum';
import { ClassType } from '../interfaces/class.interface';

export function validateService(target: ClassType, endpoints: CrudEndpoint[]) {
    for (const endpoint of endpoints) {
        const isFunction = typeof target.prototype[endpoint] === 'function';
        if (!isFunction) {
            throw new Error(`Please declare \`${endpoint}()\` in \`${target.name}\``);
        }
    }
}
