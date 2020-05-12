import { RouteInstructionType } from '@lyxs/angular/internal';

export function reset() {
    return {
        type: RouteInstructionType.Reset as RouteInstructionType.Reset,
    };
}
