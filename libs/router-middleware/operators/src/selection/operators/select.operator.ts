import { Platform } from '@frrri/routes';
import { Operation } from '../../interfaces/operation.interface';
import { SelectionOperatorType } from '../enums/selection-operator-type';

export function select(
    statePath: string,
    id: string | number,
) {
    return {
        type: SelectionOperatorType.Select as SelectionOperatorType.Select,
        statePath,
        id,
        platforms: [Platform.Resolver],
    } as Operation;
}
