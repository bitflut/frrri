import { PopulateInstruction } from '@lyxs/angular/populate';
import { deactivate } from './deactivate.instruction';
import { getActive } from './get-active.instruction';
import { getMany } from './get-many.instruction';
import { getOne } from './get-one.instruction';
import { reset } from './reset.instruction';

export type RouteInstruction =
    ReturnType<typeof getActive>
    | ReturnType<typeof getMany>
    | ReturnType<typeof getOne>
    | ReturnType<typeof reset>
    | ReturnType<typeof deactivate>
    | PopulateInstruction;
