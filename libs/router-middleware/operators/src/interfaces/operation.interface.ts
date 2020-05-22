import { Platform } from '@frrri/router-middleware';
import { OperatorType } from '../types/operator.type';

export interface Operation {
    type: OperatorType;
    statePath: string;
    platforms: Platform[];
}
