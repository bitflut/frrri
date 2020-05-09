import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { OperationContext } from '../crud-collection-state/crud-collection.state';
import { CRUD_ROUTE_DATA } from '../crud-route-data/constants';
import { PopulateRouteData, RouteData, RouteInstructionType } from '../crud-route-data/route-data';
import { StatesRegistryService } from '../states-registry/states-registry.service';

function getRouteInstructions(route: ActivatedRouteSnapshot): { [key: string]: RouteData } {
    const data = route.data[CRUD_ROUTE_DATA];
    if (!data) {
        throw new Error('Configure CrudRouteResolver via route.data');
    }
    return data;
}

function hasRouteInstructions(route: ActivatedRouteSnapshot): boolean {
    const data = route.data[CRUD_ROUTE_DATA];
    return Object.keys(data ?? {}).length > 0;
}

@Injectable({
    providedIn: 'root',
})
export class CrudRouteResolver<T = any> implements Resolve<T> {

    protected statesRegistry = this.injector.get(StatesRegistryService);
    constructor(protected injector: Injector) { }

    returnRoutePromise(routeData: RouteData & { await?: boolean }, promise$: Promise<any>): Promise<any> {
        return routeData.await ? promise$ : Promise.resolve();
    }

    resolveRouteInstructions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return async ([statePath, routeDataArray]: [string, RouteData | RouteData[]]): Promise<any> => {
            const facade = this.statesRegistry.getByPath(statePath);
            routeDataArray = Array.isArray(routeDataArray) ? routeDataArray : [routeDataArray];

            const shouldReset = routeDataArray.findIndex(data => data.type === RouteInstructionType.Clear) > -1;
            if (shouldReset) { facade.reset(); }
            if (!facade.getMany) { return; }

            const shouldDeactivate = routeDataArray.findIndex(data => data.type === RouteInstructionType.Deactivate) > -1;
            if (shouldDeactivate) { facade.deactivate(); }

            if (facade.setPopulations) {
                let populations = routeDataArray
                    .filter(data => data.type === RouteInstructionType.Populate) as PopulateRouteData[];

                const anyOperationsMissing = populations.findIndex(p => !p.operations?.length) > -1;

                if (anyOperationsMissing) {
                    const defaultOperations = routeDataArray.reduce((prev, curr) => {
                        if (prev.includes(curr.type)) { return prev; }

                        const one = [
                            RouteInstructionType.GetActive,
                            RouteInstructionType.GetOne,
                        ].includes(curr.type) && OperationContext.One;

                        const many = [
                            RouteInstructionType.GetMany,
                        ].includes(curr.type) && OperationContext.Many;

                        if (one || many) {
                            prev.push(one || many);
                        }

                        return prev;
                    }, []);

                    populations = populations.map(p => {
                        p.operations = p.operations ?? defaultOperations;
                        return p;
                    });
                }

                facade.setPopulations(populations);
            }

            return Promise.all(
                routeDataArray.map(routeData => {
                    switch (routeData.type) {
                        case RouteInstructionType.GetActive:
                        case RouteInstructionType.GetOne:
                            const id = route.params[routeData.param];
                            return this.returnRoutePromise(
                                routeData,
                                facade[routeData.type.toString()](id).toPromise(),
                            );
                        case RouteInstructionType.GetMany:
                            return this.returnRoutePromise(
                                routeData,
                                facade[routeData.type.toString()]({ params: routeData.params }).toPromise(),
                            );
                    }
                }),
            );
        };
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<T> {
        if (!hasRouteInstructions(route)) { return; }
        const collections = getRouteInstructions(route);
        return Promise.all(
            Object.entries(collections).map(this.resolveRouteInstructions(route, state)),
        ) as any;
    }

}
