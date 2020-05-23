import { Platform } from '@frrri/router-middleware';
import { Operation } from '../../../interfaces/operation.interface';
import { CrudOperatorType } from '../enums/crud-operator-type';

export function reset(
    statePath: string,
) {
    return {
        type: CrudOperatorType.Reset as CrudOperatorType.Reset,
        statePath,
        platforms: [Platform.Resolver],
    } as Operation;
}
