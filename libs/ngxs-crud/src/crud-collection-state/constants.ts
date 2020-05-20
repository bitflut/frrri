import { InjectionToken } from '@angular/core';
import { CrudCollectionOptions } from './crud-collection-options.interface';

export type CrudCollectionOptionsProvider = Partial<Pick<CrudCollectionOptions, 'baseUrl' | 'defaults' | 'idKey' | 'requestOptions' | 'endpoint'>>;
export const CRUD_COLLECTION_OPTIONS_TOKEN = new InjectionToken<CrudCollectionOptionsProvider>('CRUD_COLLECTION_OPTIONS_TOKEN');
