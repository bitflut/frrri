import { InjectionToken } from '@angular/core';
import { Middleware } from './interfaces/middleware.interface';

export const FRRRI_OPERATIONS = 'FRRRI_OPERATIONS';
export const FRRRI_MIDDLEWARE = new InjectionToken<Middleware[]>('FRRRI_MIDDLEWARE');
