import { ROUTING_INSTRUCTION } from './constants';
import { RouteInstruction } from './instructions/route-instruction.type';

export function instructions(data: { [key: string]: RouteInstruction | Array<RouteInstruction> }) {
    return {
        [ROUTING_INSTRUCTION]: data,
    };
}
