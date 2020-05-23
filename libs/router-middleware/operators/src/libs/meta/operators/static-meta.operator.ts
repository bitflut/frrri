import { Platform } from '@frrri/router-middleware';
import { Operation } from '../../../interfaces/operation.interface';
import { MetaOperatorType } from '../enums/meta-operator-type';

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
        type: MetaOperatorType.StaticMeta as MetaOperatorType.StaticMeta,
        options,
        statePath,
        platforms: [Platform.NavigationEnd],
    } as Operation;
}
