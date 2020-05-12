import { RouteInstructionType } from '@lyxs/angular/internal';
import { RouteInstruction } from '@lyxs/angular/routing';

export function extractMeta(routeDataArray: RouteInstruction[]) {
    const meta = routeDataArray
        .find(data => data.type === RouteInstructionType.Meta);

    return meta;
}
