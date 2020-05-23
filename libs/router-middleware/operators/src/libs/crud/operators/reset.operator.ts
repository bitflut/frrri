import { Platform } from '@frrri/router-middleware';
import { OperatorType } from '../../../enums/operator-type.enum';

export function reset(
    statePath: string,
) {
    return {
        type: OperatorType.Reset as OperatorType.Reset,
        statePath,
        platforms: [Platform.Resolver],
    };
}
