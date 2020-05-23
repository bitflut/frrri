import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PaginatedCrudCollectionState } from '@frrri/ngxs/pagination';
import { FRRRI_STATE_REGISTRY, Middleware, Platform } from '@frrri/router-middleware';
import { Operation } from '@frrri/router-middleware/operators';

export class NgxsNavigationEndMiddleware implements Middleware {
    platforms = [Platform.NavigationEnd];
    statesRegistry = this.injector.get(FRRRI_STATE_REGISTRY);

    constructor(protected injector: Injector) { }

    operate(operation: Operation, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(operation);
        const facade = this.statesRegistry.getByPath<PaginatedCrudCollectionState>(operation.statePath);

        switch (operation.type) {
            default:
                const isFunction = typeof facade[operation.type] === 'function';
                return isFunction && facade[operation.type]();
        }
    }
}
