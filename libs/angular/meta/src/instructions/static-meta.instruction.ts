import { META_INSTRUCTION } from '../constants';
import { MetaInstructionType } from './meta-instruction.enum';

interface Options {
    title?: string;
    keywords?: string;
    description?: string;
    image?: string;
}

export function staticMeta(
    options: Options = {},
) {
    return {
        [META_INSTRUCTION]: {
            type: MetaInstructionType.Static as MetaInstructionType.Static,
            ...options,
        },
    };
}

export type StaticMeta = Omit<ReturnType<typeof staticMeta>[typeof META_INSTRUCTION], 'type'>;
