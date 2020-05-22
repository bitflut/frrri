import { Platform } from '@frrri/routes';
import { Operation } from '../../interfaces/operation.interface';
import { crudOperatorDefaults } from '../defaults/crud-operator.defaults';
import { CrudOperatorType } from '../enums/crud-operator-type';
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
        type: CrudOperatorType.GetActive as CrudOperatorType.GetActive,
        statePath,
        platforms: [Platform.Resolver],
        ...options,
    } as Operation;
}
