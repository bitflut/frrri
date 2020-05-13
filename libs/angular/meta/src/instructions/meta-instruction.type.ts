import { activeMeta } from './active-meta.instruction';
import { staticMeta } from './static-meta.instruction';

export type MetaInstruction = Partial<
    ReturnType<typeof activeMeta>
    | ReturnType<typeof staticMeta>
>;
