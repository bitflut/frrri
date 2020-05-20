import { BREADCRUMBS_INSTRUCTION } from '../constants';
import { BreadcrumbsInstructionType } from '../enums/breadcrumbs-instruction.enum';

let index = -1;

interface StaticOptions {
    title: string;
}

export function staticBreadcrumb(
    options: StaticOptions,
) {
    index++;
    return {
        [BREADCRUMBS_INSTRUCTION]: {
            type: BreadcrumbsInstructionType.Static as BreadcrumbsInstructionType.Static,
            id: index,
            ...options,
        },
    };
}

export type StaticBreadcrumb = Omit<ReturnType<typeof staticBreadcrumb>[typeof BREADCRUMBS_INSTRUCTION], 'type'>;

interface ActiveOptions<T> {
    /** Path of state containing active entity */
    statePath: string;
    factory: (data: T) => Omit<StaticBreadcrumb, 'id'>;
}

export function activeBreadcrumb<T = any>(
    options: ActiveOptions<T>,
) {
    index++;
    return {
        [BREADCRUMBS_INSTRUCTION]: {
            type: BreadcrumbsInstructionType.Active as BreadcrumbsInstructionType.Active,
            id: index,
            ...options,
        },
    };
}

export type ActiveBreadcrumb = ReturnType<typeof activeBreadcrumb>[typeof BREADCRUMBS_INSTRUCTION];
