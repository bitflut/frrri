import { RouteInstructionType } from '@lyxs/angular/internal';

export interface MetaInstruction {
    title?: string;
    description?: string;
    image?: string;
}

export function meta(
    options: MetaInstruction = {},
) {
    return {
        type: RouteInstructionType.Meta as RouteInstructionType.Meta,
        ...options,
    };
}
