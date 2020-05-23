import { activeMeta } from '../instructions/active-meta.instruction';
import { staticMeta } from '../instructions/static-meta.instruction';

export type MetaInstruction = Partial<
    ReturnType<typeof activeMeta>
    | ReturnType<typeof staticMeta>
>;
