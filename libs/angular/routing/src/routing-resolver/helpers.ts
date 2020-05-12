import { ActivatedRouteSnapshot } from '@angular/router';
import { OperationContext, RouteInstructionType } from '@lyxs/angular/internal';
import { ROUTING_INSTRUCTION } from '../routing-instructions/constants';
import { PopulateInstruction } from '../routing-instructions/instructions/populate.instruction';
import { RouteInstruction } from '../routing-instructions/instructions/route-instruction.type';

export function getRouteInstructions(route: ActivatedRouteSnapshot): { [key: string]: RouteInstruction } {
    const data = route.data[ROUTING_INSTRUCTION];
    if (!data) {
        throw new Error('Configure CrudRouteResolver via route.data');
    }
    return data;
}

export function hasRouteInstructions(route: ActivatedRouteSnapshot): boolean {
    const data = route.data[ROUTING_INSTRUCTION];
    return Object.keys(data ?? {}).length > 0;
}

export function extractPopulations(routeDataArray: RouteInstruction[]) {
    let populations = routeDataArray
        .filter(data => data.type === RouteInstructionType.Populate) as PopulateInstruction[];

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

    return populations;
}
