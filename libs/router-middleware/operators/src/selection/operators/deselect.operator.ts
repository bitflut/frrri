import { Platform } from '@frrri/router-middleware';
import { Operation } from '../../interfaces/operation.interface';
import { SelectionOperatorType } from '../enums/selection-operator-type';

export function deselect(
    statePath: string,
) {
    return {
        type: SelectionOperatorType.Deselect as SelectionOperatorType.Deselect,
        statePath,
        platforms: [Platform.Resolver],
    } as Operation;
}
