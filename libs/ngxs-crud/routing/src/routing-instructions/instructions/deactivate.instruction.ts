import { RouteInstructionType } from '@lyxs/ngxs-crud/internal';

export function deactivate() {
    return {
        type: RouteInstructionType.Deactivate as RouteInstructionType.Deactivate,
    };
}
