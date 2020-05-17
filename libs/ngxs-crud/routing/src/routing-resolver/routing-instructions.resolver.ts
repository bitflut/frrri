import { isPlatformServer } from '@angular/common';
import { Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RouteInstructionType } from '@lyxs/ngxs-crud/internal';
import { StatesRegistryService } from '@lyxs/ngxs-crud/registry';
import { RouteInstruction } from '../routing-instructions/instructions/route-instruction.type';
import { extractPopulations, getRouteInstructions, hasRouteInstructions } from './helpers';

@Injectable({
    providedIn: 'root',
})
export class RoutingInstructionsResolver<T = any> implements Resolve<T> {

    protected statesRegistry = this.injector.get(StatesRegistryService);
    protected isPlatformServer: boolean;

    constructor(protected injector: Injector) {
        const platformId = this.injector.get(PLATFORM_ID);
        this.isPlatformServer = isPlatformServer(platformId);
    }

    returnData(instruction: RouteInstruction & { await?: boolean }, promise$: Promise<any>): Promise<any> {
        const awaitDecisionKey = this.isPlatformServer ? 'awaitPlatformServer' : 'await';
        return instruction[awaitDecisionKey] ? promise$ : Promise.resolve();
    }

    resolveInstructions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return async ([statePath, instructions]: [string, RouteInstruction | RouteInstruction[]]): Promise<any> => {
            const facade = this.statesRegistry.getByPath(statePath);
            instructions = Array.isArray(instructions) ? instructions : [instructions];

            if (facade.reset) {
                // reset()
                const shouldReset = instructions.findIndex(data => data.type === RouteInstructionType.Reset) > -1;
                if (shouldReset) { facade.reset(); }
            }

            if (facade.setPopulations) {
                // populate()
                facade.setPopulations(extractPopulations(instructions));
            }

            // CrudEntitiesState does not support getMany
            if (!facade.getMany) { return; }

            return Promise.all(
                instructions.map(routeData => {
                    const promise$ = ((): Promise<any> => {
                        switch (routeData.type) {
                            case RouteInstructionType.GetActive:
                            case RouteInstructionType.GetOne:
                                const id = route.params[routeData.param];
                                return facade[routeData.type.toString()](id).toPromise();
                            case RouteInstructionType.GetMany:
                                return facade[routeData.type.toString()]({ params: routeData.params }).toPromise();
                        }
                    })();

                    return this.returnData(routeData, promise$);
                }),
            );
        };
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<T> {
        if (!hasRouteInstructions(route.data)) { return; }
        const collections = getRouteInstructions(route.data);
        return Promise.all(
            Object.entries(collections)
                .map(this.resolveInstructions(route, state)),
        ) as any;
    }

}
