import { Platform } from '@frrri/router-middleware';
import { Operation } from '../../../interfaces/operation.interface';
import { BreadcrumbsOperatorType } from '../enums/breadcrumbs-operator-type';

let index = -1;

export interface StaticBreadcrumbOptions {
    title: string;
    id: number;
}

export function staticBreadcrumb(
    statePath: string,
    options: StaticBreadcrumbOptions,
) {
    index++;
    return {
        type: BreadcrumbsOperatorType.StaticBreadcrumb as BreadcrumbsOperatorType.StaticBreadcrumb,
        options,
        id: `static-${index}`,
        statePath,
        platforms: [Platform.NavigationEnd],
    } as Operation;
}
