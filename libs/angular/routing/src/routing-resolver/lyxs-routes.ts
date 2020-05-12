import { Routes } from '@angular/router';
import { RESOLVED_ROUTING_INSTRUCTION_KEY } from './constants';
import { RoutingInstructionsResolver } from './routing-instructions.resolver';

export function lyxsRoutes(routes: Routes, name = RESOLVED_ROUTING_INSTRUCTION_KEY): Routes {
    return routes.map(route => {
        route.resolve = {
            [name]: RoutingInstructionsResolver,
            ...route.resolve,
        };

        route.children = route.children
            ? lyxsRoutes(route.children, name)
            : undefined;

        return route;
    });
}
