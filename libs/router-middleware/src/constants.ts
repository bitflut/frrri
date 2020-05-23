import { InjectionToken } from '@angular/core';
import { Middleware } from './interfaces/middleware.interface';
import { StateRegistry } from './interfaces/state-path-registry.interface';

export const FRRRI_OPERATIONS = 'FRRRI_OPERATIONS';
export const FRRRI_MIDDLEWARE = new InjectionToken<Middleware[]>('FRRRI_MIDDLEWARE');
export const FRRRI_STATE_REGISTRY = new InjectionToken<StateRegistry>('FRRRI_STATE_REGISTRY');
