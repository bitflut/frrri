import { Platform } from '@frrri/routes';
import { OperatorType } from '../types/operator.type';

export interface Operation {
    type: OperatorType;
    statePath: string;
    platforms: Platform[];
}
