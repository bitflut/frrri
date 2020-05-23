import { RouteInstructionType } from '@frrri/ngxs-crud-legacy/internal';

export function reset() {
    return {
        type: RouteInstructionType.Reset as RouteInstructionType.Reset,
    };
}
