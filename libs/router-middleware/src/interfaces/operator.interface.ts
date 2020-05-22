import { Platform } from '../enums/platform.enum';

export interface Operator<T = any> {
    /**
     * Defines in which middlewares this operator will run
     */
    platforms: Platform[];
    options: T;
}
