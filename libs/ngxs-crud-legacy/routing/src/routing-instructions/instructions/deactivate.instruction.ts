import { RouteInstructionType } from '@frrri/ngxs-crud-legacy/internal';

export function deactivate() {
    return {
        type: RouteInstructionType.Deactivate as RouteInstructionType.Deactivate,
    };
}
