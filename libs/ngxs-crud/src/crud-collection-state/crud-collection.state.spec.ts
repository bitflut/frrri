
import { Injectable, InjectionToken } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule, State } from '@ngxs/store';
import { omit } from 'lodash';
import { CrudCollectionOptions } from './crud-collection-options.interface';
import { StateRepository } from '@ngxs-labs/data/decorators';
import { StateClass } from '@ngxs/store/internals';
import { CurdCollectionStateOptions } from './crud-colleciton-state-options.interface';
import { createEntityCollections } from '@ngxs-labs/data/utils';
import { CrudCollectionService } from './crud-collection-service.interface';
import { Observable, of } from 'rxjs';
import { CrudCollectionReducer, CrudCollectionState } from './crud-collection.state';
import { GetManyOptions } from '@frrri/ngxs-crud/internal';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

const postsData = [{
    userId: 1,
    id: 1,
    body: 'Hello World',
    title: 'testing Angular',
}, {
    userId: 2,
    id: 2,
    body: 'Hello World2',
    title: 'testing Angular2',
}];

const newPostData = {
    userId: 1,
    id: 101,
    body: 'Hello World',
    title: 'testing Angular',
};


export function TestCrudCollection<T = CrudCollectionReducer>(options: CrudCollectionOptions<T>) {
    options = {
        ...options,
        baseUrl: options.baseUrl ?? '/api',
        endpoint: options.endpoint ?? options.name.toString(),
        defaults: {
            ...createEntityCollections(),
            active: undefined,
            loaded: false,
            loading: {},
            error: {},
            ...options.defaults,
        },
    } as CrudCollectionOptions<T>;

    const stateFn = State(options);
    const stateRepositoryFn = StateRepository();
    return function (target: StateClass) {
        stateFn(target);
        stateRepositoryFn(target);
        target.prototype.serviceToken = TEST_CRUD_COLLECTION_SERVICE;

        const stateOptions = {
            requestOptions: options.requestOptions,
            endpoint: options.endpoint!,
            baseUrl: options.baseUrl!,
        } as CurdCollectionStateOptions;
        if (options.idKey) {
            stateOptions.idKey = options.idKey!;
        }
        target.prototype.stateOptions = stateOptions;
    };
}

@Injectable()
export class TestCrudCollectionService<V = any, IdType = any> implements CrudCollectionService<V, IdType> {
    getOne(stateOptions: CurdCollectionStateOptions, id: IdType) { return of({} as V); }
    getMany(stateOptions: CurdCollectionStateOptions, options: GetManyOptions = {}): Observable<V[]> { return of([]); }
    patchOne(stateOptions: CurdCollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }) { return (of({} as V)); }
    putOne(stateOptions: CurdCollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V> { return of({} as V); }
    deleteOne(stateOptions: CurdCollectionStateOptions, id: IdType) { return of({}); }
    postOne(stateOptions: CurdCollectionStateOptions, body: Partial<V>): Observable<V> { return of({} as V); }
}

export const TEST_CRUD_COLLECTION_SERVICE =
    new InjectionToken<CrudCollectionService>('TEST_CRUD_COLLECTION_SERVICE_TOKEN');


@TestCrudCollection<CrudCollectionReducer>({
    name: 'posts',
})
@Injectable()
class PostsEntitiesState extends CrudCollectionState<Post, number> {
    afterSuccess(data: Post | Post[]) { }
}

@TestCrudCollection<CrudCollectionReducer>({
    name: 'mongodbPosts',
    idKey: '_id',
})
@Injectable()
class MongodbPostsEntitiesState extends CrudCollectionState<Post, number> { }

function getCollectionUrl(state: any) {
    return state.stateOptions.requestOptions.collectionUrlFactory();
}

describe('CrudCollectionState', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgxsDataPluginModule.forRoot(),
                NgxsModule.forRoot([PostsEntitiesState, MongodbPostsEntitiesState]),
            ],
            providers: [
                {
                    provide: TEST_CRUD_COLLECTION_SERVICE,
                    useClass: TestCrudCollectionService,
                },
            ],
        }).compileComponents();
    });

    it('should getMany', inject([
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        expect(postsState.stateOptions).toBeDefined();
        expect(postsState.stateOptions.requestOptions.collectionUrlFactory).toBeDefined();
        expect(postsState.serviceToken).toBeDefined();
        spyOn(service, 'getMany').and.callThrough();
        postsState.getMany().toPromise();
        expect(service.getMany).toHaveBeenCalledTimes(1);
    }));

    it('should getMany with different idKey', inject([
        MongodbPostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: MongodbPostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        expect(getCollectionUrl(postsState)).toBeDefined();
        expect(postsState.primaryKey).toEqual('_id');

        spyOn(service, 'getMany').and.callThrough();
        postsState.getMany().toPromise();
        expect(service.getMany).toHaveBeenCalledTimes(1);
    }));

    it('should getOne', inject([
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        spyOn(service, 'getOne').and.returnValue(of(newPostData));
        postsState.getOne(1).toPromise();
        expect(service.getOne).toHaveBeenCalledTimes(1);
    }));

    it('should postOne', inject([
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        spyOn(service, 'postOne').and.returnValue(of(newPostData));
        postsState.postOne(omit(newPostData, 'id')).toPromise();
        expect(service.postOne).toHaveBeenCalledTimes(1);
    }));

    it('should postOneOptimistic', inject([
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        spyOn(service, 'postOne').and.returnValue(of(newPostData));
        postsState.postOneOptimistic(newPostData).toPromise();
        expect(service.postOne).toHaveBeenCalledTimes(1);
    }));

    it('should patchOne', inject([
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        const update = { id: 1, changes: { body: 'I am changed' } };
        spyOn(service, 'patchOne').and.returnValue(of(update));
        postsState.patchOne(update).toPromise();
        expect(service.patchOne).toHaveBeenCalledTimes(1);
    }));

    it('should patchOneOptimistic', inject([
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        postsState.addMany(postsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);

        const update = { id: 1, changes: { body: 'I am changed' } };
        spyOn(service, 'patchOne').and.returnValue(of(update));
        postsState.patchOneOptimistic(update).toPromise();
        expect(service.patchOne).toHaveBeenCalledTimes(1);
        expect(postsState.snapshot.entities[1].body).toEqual(update.changes.body);
    }));

    it('should deleteOne', inject([
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        spyOn(service, 'deleteOne').and.callThrough();
        postsState.deleteOne(1).toPromise();
        expect(service.deleteOne).toHaveBeenCalledTimes(1);
    }));

    it('should deleteOneOptimistic', inject([
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        spyOn(service, 'deleteOne').and.callThrough();
        postsState.deleteOneOptimistic(1).toPromise();
        expect(service.deleteOne).toHaveBeenCalledTimes(1);
    }));

    it('should setActive', inject([
        PostsEntitiesState,
    ], (
        postsState: PostsEntitiesState,
    ) => {
        postsState.setActive(postsData[0]);
        expect(postsState.snapshot.active).toEqual(postsData[0]);
        postsState.setActive(undefined);
        expect(postsState.snapshot.active).toEqual(undefined);
        postsState.setActive(postsData[1]);
        expect(postsState.snapshot.active).toEqual(postsData[1]);
        postsState.deactivate();
        expect(postsState.snapshot.active).toEqual(undefined);
    }));

    it('should getActive', inject([
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        spyOn(service, 'getOne').and.returnValue(of({ id: 1 }));
        postsState.getActive(1).toPromise();
        expect(postsState.snapshot.active).toEqual({ id: 1 });
        expect(postsState.snapshot.ids).toEqual([]);
        expect(service.getOne).toHaveBeenCalledTimes(1);
    }));

    it('should call afterSuccess', inject([
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        postsState: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        const spy = spyOn(postsState, 'afterSuccess');
        spyOn(service, 'getMany').and.returnValue(of(postsData));
        postsState.getMany().toPromise();
        expect(spy).toHaveBeenCalled();
    }));

});
