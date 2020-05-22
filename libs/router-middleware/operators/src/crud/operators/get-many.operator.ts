import { Platform } from '@frrri/router-middleware';
import { Operation } from '../../interfaces/operation.interface';
import { crudOperatorDefaults } from '../defaults/crud-operator.defaults';
import { CrudOperatorType } from '../enums/crud-operator-type';

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
        type: CrudOperatorType.GetMany as CrudOperatorType.GetMany,
        statePath,
        platforms: [Platform.Resolver],
        ...options,
    } as Operation;
}
