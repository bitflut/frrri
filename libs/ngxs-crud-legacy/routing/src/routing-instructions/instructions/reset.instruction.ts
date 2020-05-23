import { RouteInstructionType } from '@frrri/ngxs-crud/internal';

export function reset() {
    return {
        type: RouteInstructionType.Reset as RouteInstructionType.Reset,
    };
}
