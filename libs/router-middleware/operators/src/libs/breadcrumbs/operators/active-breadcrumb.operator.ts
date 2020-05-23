import { Platform } from '@frrri/router-middleware';
import { Operation } from '../../../interfaces/operation.interface';
import { BreadcrumbsOperatorType } from '../enums/breadcrumbs-operator-type';
import { StaticBreadcrumbOptions } from './static-breadcrumb.operator';

let index = -1;

interface ActiveOptions<T> {
    id: number;
    factory: (data: T) => Omit<StaticBreadcrumbOptions, 'id'>;
}

export function activeBreadcrumb<T = any>(
    statePath: string,
    options: ActiveOptions<T>,
) {
    index++;
    return {
        type: BreadcrumbsOperatorType.ActiveBreadcrumb as BreadcrumbsOperatorType.ActiveBreadcrumb,
        options,
        id: `active-${index}`,
        statePath,
        platforms: [Platform.NavigationEnd],
    } as Operation;
}
