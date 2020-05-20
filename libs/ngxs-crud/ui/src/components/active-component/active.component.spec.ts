import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CrudCollectionState, CrudEntities, CrudEntitiesState } from '@frrri/ngxs-crud';
import { PaginatedCrudCollectionState, PaginationInterceptor } from '@frrri/ngxs-crud/pagination';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { MockRender } from 'ng-mocks';
import { take } from 'rxjs/operators';
import { ActiveComponent } from './active.component';
import { NgxsCrudActiveModule } from './active.module';
import { TestCrudCollection, TEST_CRUD_COLLECTION_SERVICE, TestCrudCollectionService } from '../../../../src/crud-collection-state/crud-collection.state.spec';
import { TestPaginatedCrudCollection, PAGINATED_TEST_CRUD_COLLECTION_SERVICE, TestPaginatedCrudService } from '../../../../pagination/src/paginated-crud-collection-state/paginated-crud-collection.state.spec';
import { of, Subject } from 'rxjs';


interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@TestPaginatedCrudCollection({
    baseUrl: 'https://jsonplaceholder.typicode.com',
    name: 'posts',
})
@Injectable()
class PostsEntitiesState extends PaginatedCrudCollectionState<Post, number> { }

interface Comment {
    postId: number;
    id: number;
    name: string;
    body: string;
    email: string;
}

@TestCrudCollection({
    name: 'comments',
    baseUrl: 'https://jsonplaceholder.typicode.com',
})
@Injectable()
class CommentsEntitiesState extends CrudCollectionState<Comment, number> { }

@CrudEntities({
    name: 'cache',
    children: [PostsEntitiesState, CommentsEntitiesState],
})
@Injectable()
class EntityCrudEntitiesState extends CrudEntitiesState<any> { }

const page1Data = {
    body: [{
        userId: 1,
        id: 1,
        body: 'Hello World',
        title: 'testing Angular',
    }, {
        userId: 2,
        id: 2,
        body: 'Hello World2',
        title: 'testing Angular2',
    }],
    headers: {
        Link: '</api/v1/admin/posts/?sort=name&pageSize=20&next%5B%24or%5D%5B0%5D%5Bname%5D%5B%24gt%5D=Forum%20Mannheim&next%5B%24or%5D%5B1%5D%5Bname%5D%5B%24gte%5D=Forum%20Mannheim&next%5B%24or%5D%5B1%5D%5B_id%5D%5B%24gt%5D=5e4d2901871f09a8d0fc4bef>; rel="next"',
    },
};

const page2Data = {
    body: [{
        userId: 1,
        id: 3,
        body: 'Hello World3',
        title: 'testing Angular3',
    }, {
        userId: 2,
        id: 4,
        body: 'Hello World4',
        title: 'testing Angular4',
    }],
    headers: {
        Link: 'link: </api/v1/admin/stores/?sort=name&pageSize=20&next%5B%24or%5D%5B0%5D%5Bname%5D%5B%24gt%5D=LARI%20LUKE&next%5B%24or%5D%5B1%5D%5Bname%5D%5B%24gte%5D=LARI%20LUKE&next%5B%24or%5D%5B1%5D%5B_id%5D%5B%24gt%5D=5cffc130c82fe51c5afe0a9e>; rel="next"',
    },
};

const page3Data = {
    body: [{
        userId: 1,
        id: 5,
        body: 'Hello World3',
        title: 'testing Angular3',
    }],
    headers: {},
};

describe('ActiveComponent', () => {
    let component: ActiveComponent;
    let fixture: ComponentFixture<ActiveComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxsModule.forRoot([EntityCrudEntitiesState, PostsEntitiesState, CommentsEntitiesState]),
                NgxsDataPluginModule.forRoot(),
                NgxsCrudActiveModule,
            ],
            providers: [{
                provide: HTTP_INTERCEPTORS,
                multi: true,
                useClass: PaginationInterceptor,
            },
            {
                provide: PAGINATED_TEST_CRUD_COLLECTION_SERVICE,
                useClass: TestPaginatedCrudService,
            },
            {
                provide: TEST_CRUD_COLLECTION_SERVICE,
                useClass: TestCrudCollectionService,
            },
            ],
        }).compileComponents();

        fixture = MockRender(`
            <ngxs-crud-active path="cache.posts">
                My content
                <div class="loading">mock-loading</div>
            </ngxs-crud-active>
        `);

        component = fixture.debugElement
            .query(By.directive(ActiveComponent))
            .componentInstance as ActiveComponent;
    });

    it('should create and initialize', async () => {
        expect(component).toBeTruthy();
        const loading = await component.loading$.pipe(take(1)).toPromise();
        expect(loading).toBeFalsy();
    });

    it('should show contents correctly', inject([
        HttpTestingController,
        PostsEntitiesState,
        TEST_CRUD_COLLECTION_SERVICE,
    ], (
        httpMock: HttpTestingController,
        postsEntities: PostsEntitiesState,
        service: TestCrudCollectionService,
    ) => {
        // INIT
        expect(fixture.nativeElement.textContent.trim()).toEqual('My content');
        expect(fixture).toMatchSnapshot('init');
        const subject = new Subject();

        // LOADING
        spyOn(service, 'getOne').and.returnValue(subject.asObservable());
        postsEntities.getActive(1).toPromise();
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot('loading');

        // LOADED
        subject.next(page1Data.body[0]);
        fixture.detectChanges();
        expect(fixture).toMatchSnapshot('loaded');
    }));

    afterEach(inject([HttpTestingController], (httpMock: HttpTestingController) => {
        httpMock.verify();
    }));
});
