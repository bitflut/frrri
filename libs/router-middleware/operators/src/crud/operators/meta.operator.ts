import { Platform } from '@frrri/router-middleware';
import { Operation } from '../../interfaces/operation.interface';
import { CrudOperatorType } from '../enums/crud-operator-type';

export interface MetaOptions {
    title?: string;
    keywords?: string;
    description?: string;
    image?: string;
}

export interface ActiveMetaOptions<T> {
    factory: (data: T) => MetaOptions;
}

export function activeMeta<T = any>(
    statePath: string,
    options: ActiveMetaOptions<T>,
) {
    return {
        type: CrudOperatorType.ActiveMeta as CrudOperatorType.ActiveMeta,
        options,
        statePath,
        platforms: [Platform.NavigationEnd],
    } as Operation;
}

export function staticMeta(
    statePath: string,
    options: MetaOptions = {},
) {
    return {
        type: CrudOperatorType.StaticMeta as CrudOperatorType.StaticMeta,
        options,
        statePath,
        platforms: [Platform.NavigationEnd],
    } as Operation;
}
