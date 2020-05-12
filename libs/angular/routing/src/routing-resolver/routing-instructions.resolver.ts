import { isPlatformServer } from '@angular/common';
import { Injectable, Injector, PLATFORM_ID } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { RouteInstructionType } from '@lyxs/angular/internal';
import { MetaResolver } from '@lyxs/angular/meta';
import { StatesRegistryService } from '@lyxs/angular/registry';
import { RouteInstruction } from '../routing-instructions/instructions/route-instruction.type';
import { extractPopulations, getRouteInstructions, hasRouteInstructions } from './helpers';

@Injectable({
    providedIn: 'root',
})
export class RoutingInstructionsResolver<T = any> implements Resolve<T> {

    protected statesRegistry = this.injector.get(StatesRegistryService);
    protected metaResolver = this.injector.get(MetaResolver);
    protected isPlatformServer: boolean;

    constructor(protected injector: Injector) {
        const platformId = this.injector.get(PLATFORM_ID);
        this.isPlatformServer = isPlatformServer(platformId);
    }

    returnData(instruction: RouteInstruction & { await?: boolean }, promise$: Promise<any>): Promise<any> {
        const awaitDecisionKey = this.isPlatformServer ? 'awaitPlatformServer' : 'await';
        return instruction[awaitDecisionKey] ? promise$ : Promise.resolve();
    }

    async resolveMetaData(promise$: Promise<any>, instructions: RouteInstruction[], route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any> {
        const data = await promise$;
        if (data) {
            await this.metaResolver.resolveWithData(data, instructions, route, state);
        }
        return data;
    }

    resolveInstructions(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        return async ([statePath, instructions]: [string, RouteInstruction | RouteInstruction[]]): Promise<any> => {
            const facade = this.statesRegistry.getByPath(statePath);
            instructions = Array.isArray(instructions) ? instructions : [instructions];

            // reset()
            const shouldReset = instructions.findIndex(data => data.type === RouteInstructionType.Reset) > -1;
            if (shouldReset) { facade.reset(); }

            // CrudEntitiesState does not support getMany
            if (!facade.getMany) { return; }

            // deactivate()
            const shouldDeactivate = instructions.findIndex(data => data.type === RouteInstructionType.Deactivate) > -1;
            if (shouldDeactivate) { facade.deactivate(); }

            // populate()
            if (facade.setPopulations) {
                facade.setPopulations(extractPopulations(instructions));
            }

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

                    return this.returnData(
                        routeData,
                        // Resolve metadata once data is loaded
                        this.resolveMetaData(promise$, instructions as RouteInstruction[], route, state),
                    );
                }),
            );
        };
    }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<T> {
        if (!hasRouteInstructions(route)) { return; }
        const collections = getRouteInstructions(route);
        return Promise.all(
            Object.entries(collections)
                .map(this.resolveInstructions(route, state)),
        ) as any;
    }

}
