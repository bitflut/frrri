import { activeBreadcrumb } from '../libs/breadcrumbs/active-breadcrumb.operator';
import { staticBreadcrumb } from '../libs/breadcrumbs/static-breadcrumb.operator';
import { getActive } from '../libs/crud/operators/get-active.operator';
import { getMany } from '../libs/crud/operators/get-many.operator';
import { getOne } from '../libs/crud/operators/get-one.operator';
import { populate } from '../libs/crud/operators/populate.operator';
import { reset } from '../libs/crud/operators/reset.operator';
import { activeMeta } from '../libs/meta/active-meta.operator';
import { staticMeta } from '../libs/meta/static-meta.operator';
import { deselect } from '../libs/selection/deselect.operator';
import { select } from '../libs/selection/select.operator';

export type Operation =
    ReturnType<typeof getMany>
    | ReturnType<typeof getOne>
    | ReturnType<typeof getActive>
    | ReturnType<typeof populate>
    | ReturnType<typeof reset>
    | ReturnType<typeof deselect>
    | ReturnType<typeof select>
    | ReturnType<typeof activeBreadcrumb>
    | ReturnType<typeof staticBreadcrumb>
    | ReturnType<typeof activeMeta>
    | ReturnType<typeof staticMeta>;
