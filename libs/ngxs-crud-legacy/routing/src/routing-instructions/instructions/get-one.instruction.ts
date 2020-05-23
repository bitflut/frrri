import { RouteInstructionType } from '@frrri/ngxs-crud-legacy/internal';
import { Instruction, instructionDefaults } from './instruction-defaults';

export interface GetOneInstruction extends Instruction {
    /** Key in route.params containing the id to resolve (default: `'id'`) */
    param?: string;
}

export function getOne(
    options: GetOneInstruction = {},
) {
    options = {
        ...instructionDefaults,
        param: 'id',
        ...options,
    };

    return {
        type: RouteInstructionType.GetOne as RouteInstructionType.GetOne,
        ...options,
    };
}
