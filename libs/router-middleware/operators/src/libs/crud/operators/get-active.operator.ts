import { Platform } from '@frrri/router-middleware';
import { OperatorType } from '../../../enums/operator-type.enum';
import { crudOperatorDefaults } from '../defaults/crud-operator.defaults';
import { GetOneOptions } from './get-one.operator';

export function getActive(
    statePath: string,
    options: GetOneOptions = {},
) {
    options = {
        ...crudOperatorDefaults,
        param: 'id',
        ...options,
    };

    return {
        type: OperatorType.GetActive as OperatorType.GetActive,
        statePath,
        platforms: [Platform.Resolver],
        ...options,
    };
}
