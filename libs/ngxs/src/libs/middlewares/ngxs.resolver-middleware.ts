import { Injector } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { PaginatedCrudCollectionState } from '@frrri/ngxs/pagination';
import { FRRRI_STATE_REGISTRY, Middleware } from '@frrri/router-middleware';
import { Platform } from '@frrri/router-middleware/internal';
import { Operation, OperatorType } from '@frrri/router-middleware/operators';

export class NgxsResolverMiddleware implements Middleware {
    platforms = [Platform.Resolver];
    statesRegistry = this.injector.get(FRRRI_STATE_REGISTRY);

    constructor(protected injector: Injector) { }

    operate(operation: Operation, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        console.log(operation);

        let facade: PaginatedCrudCollectionState;
        if ('statePath' in operation && operation.statePath) {
            facade = this.statesRegistry.getByPath<PaginatedCrudCollectionState>(operation.statePath);
        }

        switch (operation.type) {
            case OperatorType.GetActive:
                return facade.getActive(route.params[operation.param]);
            case OperatorType.GetOne:
                return facade.getOne(route.params[operation.param]);
            case OperatorType.GetMany:
                return facade.getMany({ params: operation.params });

            default:
                const isFunction = typeof facade?.[operation.type] === 'function';
                return isFunction && facade?.[operation.type]();
        }
    }
}
