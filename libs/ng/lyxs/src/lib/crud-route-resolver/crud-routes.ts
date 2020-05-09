import { Routes } from '@angular/router';
import { CRUD_ROUTE_RESOLVE_KEY } from './constants';
import { CrudRouteResolver } from './crud-route.resolver';

export function crudRoutes(routes: Routes, name = CRUD_ROUTE_RESOLVE_KEY): Routes {
    return routes.map(route => {
        route.resolve = {
            [name]: CrudRouteResolver,
            ...route.resolve,
        };

        route.children = route.children
            ? crudRoutes(route.children, name)
            : undefined;

        return route;
    });
}
