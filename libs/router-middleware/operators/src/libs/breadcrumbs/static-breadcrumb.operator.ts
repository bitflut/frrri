import { Platform } from '@frrri/router-middleware';
import { OperatorType } from '../../enums/operator-type.enum';

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
        type: OperatorType.StaticBreadcrumb as OperatorType.StaticBreadcrumb,
        options,
        id: `static-${index}`,
        statePath,
        platforms: [Platform.NavigationEnd],
    };
}
