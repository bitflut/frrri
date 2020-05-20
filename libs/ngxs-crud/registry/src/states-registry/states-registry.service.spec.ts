import { Injectable, NgModule } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CrudCollectionState, CrudEntities, CrudEntitiesState } from '@frrri/ngxs-crud';
import { PaginatedCrudCollectionState } from '@frrri/ngxs-crud/pagination';
import { StatesRegistryService } from '@frrri/ngxs-crud/registry';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { TestCrudCollection, TestCrudCollectionService, TEST_CRUD_COLLECTION_SERVICE } from '../../../src/crud-collection-state/crud-collection.state.spec';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@TestCrudCollection({
    baseUrl: 'https://jsonplaceholder.typicode.com/posts',
    name: 'posts',
})
@Injectable()
class PostsEntitiesState extends CrudCollectionState<Post, number> { }

interface Comment {
    postId: number;
    id: number;
    name: string;
    body: string;
    email: string;
}

@TestCrudCollection({
    name: 'comments',
    baseUrl: 'https://jsonplaceholder.typicode.com/comments',
})
@Injectable()
class CommentsEntitiesState extends CrudCollectionState<Comment, number> { }

@CrudEntities({
    name: 'cache',
    defaults: {},
    children: [PostsEntitiesState, CommentsEntitiesState],
})
@Injectable()
class EntityCrudEntitiesState extends CrudEntitiesState<any> { }

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

@TestCrudCollection({
    name: 'users',
    baseUrl: 'https://jsonplaceholder.typicode.com/users',
})
@Injectable()
class UsersEntitiesState extends CrudCollectionState<Comment, number> { }


@NgModule({
    imports: [
        NgxsModule.forFeature([UsersEntitiesState]),
    ],
})
class FeatureModule { }

describe('StatesRegistry', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                NgxsModule.forRoot([EntityCrudEntitiesState, PostsEntitiesState, CommentsEntitiesState]),
                NgxsDataPluginModule.forRoot(),
                FeatureModule,
            ],
            providers: [
                {
                    provide: TEST_CRUD_COLLECTION_SERVICE,
                    useClass: TestCrudCollectionService,
                },
            ],
        });
    });

    it('should register states', inject([
        PostsEntitiesState,
        EntityCrudEntitiesState,
        StatesRegistryService,
    ], (
        postsState: PostsEntitiesState,
        entityCrudEntitiesState: EntityCrudEntitiesState,
        collectionRegistry: StatesRegistryService<PaginatedCrudCollectionState>,
    ) => {
        expect(collectionRegistry.getByPath('cache.posts').stateOptions.requestOptions.collectionUrlFactory).toBeDefined();
        expect(postsState).toBe(collectionRegistry.getByPath('cache.posts'));
        expect(entityCrudEntitiesState).toBe(collectionRegistry.getByPath('cache'));
    }));

    it('should reset all states', inject([
        StatesRegistryService,
        TEST_CRUD_COLLECTION_SERVICE,
    ], async (
        collectionRegistry: StatesRegistryService<PaginatedCrudCollectionState>,
        service: TestCrudCollectionService,
    ) => {
        const postsState = collectionRegistry.getByPath('cache.posts');
        expect(postsState).toBeDefined();
        spyOn(service, 'getMany').and.returnValue(of(postsData));
        postsState.getMany().toPromise();
        expect(postsState.snapshot.ids).toEqual([1, 2]);

        const cacheState = collectionRegistry.getByPath('cache');
        cacheState.reset();
        expect(postsState.snapshot.ids).toEqual([]);
    }));

    it('should get UserEntitiesState', inject([
        StatesRegistryService,
    ], async (
        collectionRegistry: StatesRegistryService,
    ) => {
        expect(collectionRegistry.getByPath('users')).toBeDefined();
    }));

});
