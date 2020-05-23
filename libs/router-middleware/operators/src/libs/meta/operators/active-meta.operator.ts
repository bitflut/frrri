import { Platform } from '@frrri/router-middleware';
import { Operation } from '../../../interfaces/operation.interface';
import { MetaOperatorType } from '../enums/meta-operator-type';
import { StaticMetaOptions } from './static-meta.operator';

export interface ActiveMetaOptions<T> {
    factory: (data: T) => StaticMetaOptions;
}

export function activeMeta<T = any>(
    statePath: string,
    options: ActiveMetaOptions<T>,
) {
    return {
        type: MetaOperatorType.ActiveMeta as MetaOperatorType.ActiveMeta,
        options,
        statePath,
        platforms: [Platform.NavigationEnd],
    } as Operation;
}
