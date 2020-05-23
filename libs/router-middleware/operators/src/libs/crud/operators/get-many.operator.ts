import { Platform } from '@frrri/router-middleware';
import { OperatorType } from '../../../enums/operator-type.enum';
import { crudOperatorDefaults } from '../defaults/crud-operator.defaults';

export function getMany(
    statePath: string,
    options: {
        /** Params passed to getMany */
        params?: { [key: string]: string | string[] };
    } = {},
) {
    options = {
        ...crudOperatorDefaults,
        params: {},
        ...options,
    };

    return {
        type: OperatorType.GetMany as OperatorType.GetMany,
        statePath,
        platforms: [Platform.Resolver],
        ...options,
    };
}
