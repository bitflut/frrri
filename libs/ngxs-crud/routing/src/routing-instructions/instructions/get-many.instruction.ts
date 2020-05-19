import { RouteInstructionType } from '@frrri/ngxs-crud/internal';
import { Instruction, instructionDefaults } from './instruction-defaults';

export interface GetManyInstruction extends Instruction {
    /** Params passed to getMany */
    params?: { [key: string]: string | string[] };
}

export function getMany(
    options: GetManyInstruction = {},
) {
    options = {
        ...instructionDefaults,
        params: {},
        ...options,
    };

    return {
        type: RouteInstructionType.GetMany as RouteInstructionType.GetMany,
        ...options,
    };
}
