import { Platform } from '@frrri/router-middleware';
import { Operation } from '../../../interfaces/operation.interface';
import { crudOperatorDefaults } from '../defaults/crud-operator.defaults';
import { CrudOperatorType } from '../enums/crud-operator-type';
import { CrudOperatorOptions } from '../interfaces/crud-operator-options.interface';

export interface GetOneOptions extends CrudOperatorOptions {
    /** Key in route.params containing the id to resolve (default: `'id'`) */
    param?: string;
}

export function getOne(
    statePath: string,
    options: GetOneOptions = {},
) {
    options = {
        ...crudOperatorDefaults,
        param: 'id',
        ...options,
    };

    return {
        type: CrudOperatorType.GetOne as CrudOperatorType.GetOne,
        statePath,
        platforms: [Platform.Resolver],
        ...options,
    } as Operation;
}
