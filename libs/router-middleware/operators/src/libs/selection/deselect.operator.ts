import { Platform } from '@frrri/router-middleware';
import { OperatorType } from '../../enums/operator-type.enum';

export function deselect(
    statePath: string,
) {
    return {
        type: OperatorType.Deselect as OperatorType.Deselect,
        statePath,
        platforms: [Platform.Resolver],
    };
}
