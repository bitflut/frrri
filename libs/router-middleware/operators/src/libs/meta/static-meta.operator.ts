import { Platform } from '@frrri/router-middleware';
import { OperatorType } from '../../enums/operator-type.enum';

export interface StaticMetaOptions {
    title?: string;
    keywords?: string;
    description?: string;
    image?: string;
}

export function staticMeta(
    statePath: string,
    options: StaticMetaOptions = {},
) {
    return {
        type: OperatorType.StaticMeta as OperatorType.StaticMeta,
        options,
        statePath,
        platforms: [Platform.NavigationEnd],
    };
}
