
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable, InjectionToken, NgModule, ModuleWithProviders, Injector } from '@angular/core';
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
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { CrudCollectionReducer, CrudCollectionState } from './crud-collection.state';
import { GetManyOptions } from '@frrri/ngxs-crud/internal';
import { HttpClient } from '@angular/common/http';

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
    protected http = this.injector.get(HttpClient);

    constructor(protected injector: Injector) { }

    getOne(stateOptions: CurdCollectionStateOptions, id: IdType) {
        const url = stateOptions.requestOptions.resourceUrlFactory(id);
        return this.http.get<V>(url);
    }

    getMany(stateOptions: CurdCollectionStateOptions, options: GetManyOptions = {}): Observable<V[]> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.get<V[]>(url, { params: options.params });
    }

    patchOne(stateOptions: CurdCollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }) {
        const url = stateOptions.requestOptions.resourceUrlFactory(id);
        return this.http.patch<V>(url, changes);
    }

    putOne(stateOptions: CurdCollectionStateOptions, id: IdType, changes: { [key: string]: Partial<V> }): Observable<V> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.put<V>(url, changes);
    }

    deleteOne(stateOptions: CurdCollectionStateOptions, id: IdType) {
        const url = stateOptions.requestOptions.resourceUrlFactory(id);
        return this.http.delete<void>(url);
    }

    postOne(stateOptions: CurdCollectionStateOptions, body: Partial<V>): Observable<V> {
        const url = stateOptions.requestOptions.collectionUrlFactory();
        return this.http.post<V>(
            url,
            body,
        );
    }
}

export const TEST_CRUD_COLLECTION_SERVICE =
    new InjectionToken<CrudCollectionService>('TEST_CRUD_COLLECTION_SERVICE_TOKEN');


@NgModule({
    imports: [CommonModule],
})
export class TestCrudCollectionModule {

    constructor(
    ) { }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: TestCrudCollectionModule,
            providers: [
                {
                    provide: TEST_CRUD_COLLECTION_SERVICE,
                    useClass: TestCrudCollectionService,
                },
            ],
        };
    }
}

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
                HttpClientTestingModule,
                TestCrudCollectionModule.forRoot(),
                NgxsDataPluginModule.forRoot(),
                NgxsModule.forRoot([PostsEntitiesState, MongodbPostsEntitiesState]),
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
        spyOn(service, 'getOne').and.callThrough();
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
        spyOn(service, 'postOne').and.callThrough();
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
        spyOn(service, 'postOne').and.callThrough();
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
        spyOn(service, 'patchOne').and.callThrough();
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
        spyOn(service, 'patchOne').and.callThrough();
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
        spyOn(service, 'getOne').and.callThrough();
        postsState.getActive(1).toPromise();
        expect(postsState.snapshot.active).toEqual({ id: 1 });
        expect(postsState.snapshot.ids).toEqual([]);
        expect(service.getOne).toHaveBeenCalledTimes(1);
    }));

    it('should call afterSuccess', inject([
        HttpTestingController,
        PostsEntitiesState,
    ], (
        httpMock: HttpTestingController,
        postsState: PostsEntitiesState,
    ) => {
        const spy = spyOn(postsState, 'afterSuccess');
        postsState.getMany().toPromise();

        const req = httpMock.expectOne(getCollectionUrl(postsState));
        expect(req.request.method).toEqual('GET');
        req.flush(postsData);

        expect(spy).toHaveBeenCalled();
    }));

});
