import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable, NgModule } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { CacheState } from '../cache-state/cache-state.state';
import { Cache } from '../cache-state/cache.decorator';
import { CrudCollection } from '../crud-collection-state/crud-collection.decorator';
import { CrudCollectionState } from '../crud-collection-state/crud-collection.state';
import { PaginatedCrudCollectionState } from '../paginated-crud-collection-state/paginated-crud-collection.state';
import { StatesRegistryService } from './states-registry.service';

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

@Cache({
    name: 'cache',
    defaults: {},
    children: [PostsEntitiesState, CommentsEntitiesState],
})
@Injectable()
class EntityCacheState extends CacheState<any> { }

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
                NgxsModule.forRoot([EntityCacheState, PostsEntitiesState, CommentsEntitiesState]),
                NgxsDataPluginModule.forRoot(),
                FeatureModule,
            ],
        });
    });

    it('should register states', inject([
        PostsEntitiesState,
        EntityCacheState,
        StatesRegistryService,
    ], (
        postsState: PostsEntitiesState,
        entityCacheState: EntityCacheState,
        collectionRegistry: StatesRegistryService<PaginatedCrudCollectionState>,
    ) => {
        expect(collectionRegistry.getByPath('cache.posts').requestOptions.collectionUrlFactory).toBeDefined();
        expect(postsState).toBe(collectionRegistry.getByPath('cache.posts'));
        expect(entityCacheState).toBe(collectionRegistry.getByPath('cache'));
    }));

    it('should reset all states', inject([
        HttpTestingController,
        StatesRegistryService,
    ], async (
        httpMock: HttpTestingController,
        collectionRegistry: StatesRegistryService,
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
