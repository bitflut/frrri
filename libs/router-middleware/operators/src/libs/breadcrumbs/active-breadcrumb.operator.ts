import { Platform } from '@frrri/router-middleware';
import { OperatorType } from '../../enums/operator-type.enum';
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
        type: OperatorType.ActiveBreadcrumb as OperatorType.ActiveBreadcrumb,
        options,
        id: `active-${index}`,
        statePath,
        platforms: [Platform.NavigationEnd],
    };
}
