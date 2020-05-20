import { GetManyOptions } from '@frrri/ngxs-crud/internal';
import { Observable } from 'rxjs';
import { CurdCollectionStateOptions } from './crud-colleciton-state-options.interface';

export interface CrudCollectionService {

    getOne<V, IdType>(stateOptions: CurdCollectionStateOptions, id: IdType): Observable<V>;
    getMany<V>(stateOptions: CurdCollectionStateOptions, options: GetManyOptions): Observable<V[]>;
    patchOne<V, IdType>(stateOptions: CurdCollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V>;
    putOne<V, IdType>(stateOptions: CurdCollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V>;
    deleteOne<IdType>(stateOptions: CurdCollectionStateOptions, id: IdType);
    postOne<V>(stateOptions: CurdCollectionStateOptions, body: Partial<V>): Observable<V>;
}
