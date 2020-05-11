import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable, NgModule } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { CrudCollection, CrudCollectionState, CrudEntities, CrudEntitiesState } from '@lyxs/angular';
import { PaginatedCrudCollectionState } from '@lyxs/angular/pagination';
import { StatesRegistryService } from '@lyxs/angular/registry';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@CrudCollection({
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

@CrudCollection({
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

@CrudCollection({
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
                HttpClientTestingModule,
                NgxsModule.forRoot([EntityCrudEntitiesState, PostsEntitiesState, CommentsEntitiesState]),
                NgxsDataPluginModule.forRoot(),
                FeatureModule,
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
        expect(collectionRegistry.getByPath('cache.posts').requestOptions.collectionUrlFactory).toBeDefined();
        expect(postsState).toBe(collectionRegistry.getByPath('cache.posts'));
        expect(entityCrudEntitiesState).toBe(collectionRegistry.getByPath('cache'));
    }));

    it('should reset all states', inject([
        HttpTestingController,
        StatesRegistryService,
    ], async (
        httpMock: HttpTestingController,
        collectionRegistry: StatesRegistryService<PaginatedCrudCollectionState>,
    ) => {
        const postsState = collectionRegistry.getByPath('cache.posts');
        expect(postsState).toBeDefined();
        postsState.getMany().toPromise();
        httpMock.expectOne(postsState.requestOptions.collectionUrlFactory()).flush(postsData);
        expect(postsState.snapshot.ids).toEqual([1, 2]);

        const cacheState = collectionRegistry.getByPath('cache');
        cacheState.reset();
        expect(postsState.snapshot.ids).toEqual([]);
    }));

    it('should get UserEntitiesState', inject([
        HttpTestingController,
        StatesRegistryService,
    ], async (
        httpMock: HttpTestingController,
        collectionRegistry: StatesRegistryService,
    ) => {
        expect(collectionRegistry.getByPath('users')).toBeDefined();
    }));

});
