import { Routes } from '@angular/router';
import { MetaResolver } from '@lyxs/ngxs-crud/meta';
import { RoutingInstructionsResolver } from './routing-instructions.resolver';

export function lyxsRoutes(
    routes: Routes,
    options: { meta?: boolean; } = { meta: true },
): Routes {
    return routes.map(route => {
        const resolveMeta = options.meta
            ? { ['RESOLVED_ROUTING_META']: MetaResolver }
            : undefined;

        route.resolve = {
            ['RESOLVED_ROUTING_INSTRUCTION']: RoutingInstructionsResolver,
            ...resolveMeta,
            ...route.resolve,
        };

        route.children = route.children
            ? lyxsRoutes(route.children, options)
            : undefined;

        return route;
    });
}
