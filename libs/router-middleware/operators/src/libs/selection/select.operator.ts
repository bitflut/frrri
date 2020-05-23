import { Platform } from '@frrri/router-middleware';
import { OperatorType } from '../../enums/operator-type.enum';

export function select(
    statePath: string,
    id: string | number,
) {
    return {
        type: OperatorType.Select as OperatorType.Select,
        statePath,
        id,
        platforms: [Platform.Resolver],
    };
}
