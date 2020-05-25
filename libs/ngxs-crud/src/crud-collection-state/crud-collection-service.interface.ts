import { GetManyOptions } from '@frrri/ngxs-crud/internal';
import { Observable } from 'rxjs';
import { CurdCollectionStateOptions } from './crud-colleciton-state-options.interface';

export interface CrudCollectionService<V = any, IdType = any> {
    getOne(stateOptions: CurdCollectionStateOptions, id: IdType): Observable<V>;
    getMany(stateOptions: CurdCollectionStateOptions, options: GetManyOptions): Observable<V[]>;
    patchOne(stateOptions: CurdCollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V>;
    putOne(stateOptions: CurdCollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V>;
    deleteOne(stateOptions: CurdCollectionStateOptions, id: IdType): Observable<void>;
    postOne(stateOptions: CurdCollectionStateOptions, body: Partial<V>): Observable<V>;
}
