import { RouteInstructionType } from '@frrri/ngxs-crud-legacy/internal';
import { GetOneInstruction } from './get-one.instruction';
import { instructionDefaults } from './instruction-defaults';

export function getActive(
    options: GetOneInstruction = {},
) {
    options = {
        ...instructionDefaults,
        param: 'id',
        ...options,
    };

    return {
        type: RouteInstructionType.GetActive as RouteInstructionType.GetActive,
        ...options,
    };
}
