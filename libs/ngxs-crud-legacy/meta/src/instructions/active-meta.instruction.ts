import { META_INSTRUCTION } from '../constants';
import { MetaInstructionType } from '../enums/meta-instruction.enum';
import { StaticMeta } from './static-meta.instruction';

export interface Options<T> {
    /** Path of state containing active entity */
    statePath: string;
    factory: (data: T) => StaticMeta;
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

export type ActiveMeta = ReturnType<typeof activeMeta>[typeof META_INSTRUCTION];
