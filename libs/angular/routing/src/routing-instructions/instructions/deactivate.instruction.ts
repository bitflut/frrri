import { RouteInstructionType } from '@lyxs/angular/internal';

export function deactivate() {
    return {
        type: RouteInstructionType.Deactivate as RouteInstructionType.Deactivate,
    };
}
