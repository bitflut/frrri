import { Injectable } from '@angular/core';
import { ActivationEnd, Data, NavigationStart, Router } from '@angular/router';
import { RouteInstructionType } from '@lyxs/angular/internal';
import { PaginatedCrudCollectionState } from '@lyxs/angular/pagination';
import { StatesRegistryService } from '@lyxs/angular/registry';
import { concatMapTo, filter, take } from 'rxjs/operators';
import { RouteInstruction } from '../routing-instructions/instructions/route-instruction.type';
import { getRouteInstructions, hasRouteInstructions } from '../routing-resolver/helpers';

@Injectable({
    providedIn: 'root',
})
export class RoutingNavigationService {

    constructor(
        private router: Router,
        private statesRegistry: StatesRegistryService<PaginatedCrudCollectionState>,
    ) {
        this.router.events.pipe(
            filter(startEvent => startEvent instanceof NavigationStart),
            concatMapTo(this.router.events
                .pipe(
                    filter(event => event instanceof ActivationEnd),
                    take(1),
                ),
            ),
        )
            .subscribe(event => this.resolve(event['snapshot'].data));
    }

    resolveInstructions() {
        return async ([statePath, instructions]: [string, RouteInstruction | RouteInstruction[]]): Promise<any> => {
            const facade = this.statesRegistry.getByPath(statePath);
            instructions = Array.isArray(instructions) ? instructions : [instructions];

            if (facade.deactivate) {
                // deactivate()
                const shouldDeactivate = instructions.findIndex(data => data.type === RouteInstructionType.Deactivate) > -1;
                if (shouldDeactivate) { facade.deactivate(); }
            }
        };
    }

    async resolve(data: Data) {
        if (!hasRouteInstructions(data)) { return; }
        const collections = getRouteInstructions(data);
        // tslint:disable-next-line: no-unused-expression
        await Promise.all(
            Object.entries(collections)
                .map(this.resolveInstructions()),
        ) as any;
    }

}
