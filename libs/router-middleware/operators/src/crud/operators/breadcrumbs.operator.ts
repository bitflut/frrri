import { Platform } from '@frrri/router-middleware';
import { Operation } from '../../interfaces/operation.interface';
import { CrudOperatorType } from '../enums/crud-operator-type';

let index = -1;

interface StaticOptions {
    title: string;
    id: number;
}

interface ActiveOptions<T> {
    id: number;
    factory: (data: T) => Omit<StaticOptions, 'id'>;
}

export function staticBreadcrumb(
    statePath: string,
    options: StaticOptions,
) {
    index++;
    return {
        type: CrudOperatorType.StaticBreadcrumb as CrudOperatorType.StaticBreadcrumb,
        options: { ...options, id: index },
        statePath,
        platforms: [Platform.NavigationEnd],
    } as Operation;
}

export function activeBreadcrumb<T = any>(
    statePath: string,
    options: ActiveOptions<T>,
) {
    index++;
    return {
        type: CrudOperatorType.ActiveBreadcrumb as CrudOperatorType.ActiveBreadcrumb,
        options: { ...options, id: index },
        statePath,
        platforms: [Platform.NavigationEnd],
    } as Operation;
}
