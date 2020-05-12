import { META_INSTRUCTION } from '../constants';
import { MetaInstructionType } from './meta-instruction.enum';
import { staticMeta } from './static-meta.instruction';

type FactoryReturnType = Omit<ReturnType<typeof staticMeta>[typeof META_INSTRUCTION], 'type'>;

export interface Options<T> {
    /** Path of state containing active entity */
    statePath: string;
    factory: (data: T) => FactoryReturnType;
}

export function activeMeta<T = any>(
    options: Options<T>,
) {
    return {
        [META_INSTRUCTION]: {
            type: MetaInstructionType.Active as MetaInstructionType.Active,
            ...options,
        },
    };
}
