import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CRUD_ROUTE_DATA } from '../crud-route-data/constants';
import { RouteData, RouteInstructionType } from '../crud-route-data/route-data';
import { StatesRegistryService } from '../states-registry/states-registry.service';

function getRouteData(route: ActivatedRouteSnapshot): { [key: string]: RouteData } {
    const data = route.data[CRUD_ROUTE_DATA];
    if (!data) {
        throw new Error('Configure CrudRouteResolver via route.data');
    }
    return data;
}

function hasRouteData(route: ActivatedRouteSnapshot): boolean {
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

    resolveRouteData(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return async ([statePath, routeDataArray]: [string, RouteData | RouteData[]]): Promise<any> => {
            const facade = this.statesRegistry.getByPath(statePath);
            routeDataArray = Array.isArray(routeDataArray) ? routeDataArray : [routeDataArray];
            console.log(routeDataArray);

            facade.setPopulations(
                routeDataArray
                    .filter(data => data.type === RouteInstructionType.Populate),
            );

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
                                facade[routeData.type.toString()]().toPromise(),
                            );
                    }
                }),
            );
        };
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<T> {
        if (!hasRouteData(route)) { return; }
        const collections = getRouteData(route);
        return Promise.all(
            Object.entries(collections).map(this.resolveRouteData(route, state)),
        ) as any;
    }

}
