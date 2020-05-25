import { Observable } from 'rxjs';
import { CollectionStateOptions } from './colleciton-state-options.interface';
import { GetManyOptions } from '@frrri/ngxs/internal';

export interface CollectionService<V = any, IdType = any> {
    getOne(stateOptions: CollectionStateOptions, id: IdType): Observable<V>;
    getMany(stateOptions: CollectionStateOptions, options: GetManyOptions): Observable<V[]>;
    patchOne(stateOptions: CollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V>;
    putOne(stateOptions: CollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V>;
    deleteOne(stateOptions: CollectionStateOptions, id: IdType): Observable<void>;
    postOne(stateOptions: CollectionStateOptions, body: Partial<V>): Observable<V>;
}
