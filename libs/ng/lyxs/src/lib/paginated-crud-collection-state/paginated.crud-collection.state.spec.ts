import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { PaginatedCrudCollection } from './paginated-crud-collection.decorator';
import { PaginatedCrudCollectionReducer, PaginatedCrudCollectionState } from './paginated-crud-collection.state';
import { PaginationInterceptor } from './pagination.interceptor';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

const collectionUrl = 'https://jsonplaceholder.typicode.com';

const page1Data = {
    body: [
        {
            userId: 1,
            id: 1,
            body: 'Hello World',
            title: 'testing Angular',
        },
        {
            userId: 2,
            id: 2,
            body: 'Hello World2',
            title: 'testing Angular2',
        },
    ],
    headers: {
        Link:
            '</api/v1/admin/posts/?sort=name&pageSize=20&next%5B%24or%5D%5B0%5D%5Bname%5D%5B%24gt%5D=Forum%20Mannheim&next%5B%24or%5D%5B1%5D%5Bname%5D%5B%24gte%5D=Forum%20Mannheim&next%5B%24or%5D%5B1%5D%5B_id%5D%5B%24gt%5D=5e4d2901871f09a8d0fc4bef>; rel="next"',
    },
};

const page2Data = {
    body: [
        {
            userId: 1,
            id: 3,
            body: 'Hello World3',
            title: 'testing Angular3',
        },
        {
            userId: 2,
            id: 4,
            body: 'Hello World4',
            title: 'testing Angular4',
        },
    ],
    headers: {
        Link:
            'link: </api/v1/admin/stores/?sort=name&pageSize=20&next%5B%24or%5D%5B0%5D%5Bname%5D%5B%24gt%5D=LARI%20LUKE&next%5B%24or%5D%5B1%5D%5Bname%5D%5B%24gte%5D=LARI%20LUKE&next%5B%24or%5D%5B1%5D%5B_id%5D%5B%24gt%5D=5cffc130c82fe51c5afe0a9e>; rel="next"',
    },
};

@PaginatedCrudCollection<PaginatedCrudCollectionReducer>({
    name: 'post',
    baseUrl: collectionUrl,
})
@Injectable()
class PostsEntitiesState extends PaginatedCrudCollectionState<Post, number> { }

describe('PaginatedCollectionState', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                NgxsDataPluginModule.forRoot(),
                NgxsModule.forRoot([PostsEntitiesState]),
            ],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    multi: true,
                    useClass: PaginationInterceptor,
                },
            ],
        }).compileComponents();
    });

    it('should getMany without pagination', inject(
        [HttpTestingController, PostsEntitiesState],
        (httpMock: HttpTestingController, postsState: PostsEntitiesState) => {
            postsState.getMany().toPromise();

            const req = httpMock.expectOne(
                postsState.requestOptions.collectionUrlFactory(),
            );
            expect(req.request.method).toEqual('GET');
            req.flush(page1Data.body);
            expect(postsState.snapshot.ids).toEqual([1, 2]);
            expect(postsState.snapshot.next).toBeUndefined();
        },
    ));

    it('should getMany with pagination', inject(
        [HttpTestingController, PostsEntitiesState],
        (httpMock: HttpTestingController, postsState: PostsEntitiesState) => {
            postsState.getMany().toPromise();

            const req = httpMock.expectOne(
                postsState.requestOptions.collectionUrlFactory(),
            );
            expect(req.request.method).toEqual('GET');
            req.flush(page1Data.body, {
                headers: page1Data.headers,
            });
            expect(postsState.snapshot.ids).toEqual([1, 2]);
            expect(postsState.snapshot.next).toMatchInlineSnapshot(`
                Object {
                  "next[$or][0][name][$gt]": "Forum Mannheim",
                  "next[$or][1][_id][$gt]": "5e4d2901871f09a8d0fc4bef",
                  "next[$or][1][name][$gte]": "Forum Mannheim",
                  "pageSize": "20",
                  "sort": "name",
                }
            `);
        },
    ));

    it('should getNext', inject(
        [HttpTestingController, PostsEntitiesState],
        (httpMock: HttpTestingController, postsState: PostsEntitiesState) => {
            postsState.getMany().toPromise();

            const req = httpMock.expectOne(
                postsState.requestOptions.collectionUrlFactory(),
            );
            expect(req.request.method).toEqual('GET');
            req.flush(page1Data.body, {
                headers: page1Data.headers,
            });
            expect(postsState.snapshot.ids).toEqual([1, 2]);
            expect(postsState.snapshot.next).toMatchInlineSnapshot(`
                Object {
                  "next[$or][0][name][$gt]": "Forum Mannheim",
                  "next[$or][1][_id][$gt]": "5e4d2901871f09a8d0fc4bef",
                  "next[$or][1][name][$gte]": "Forum Mannheim",
                  "pageSize": "20",
                  "sort": "name",
                }
            `);

            postsState.getNext().toPromise();

            const req2 = httpMock.expectOne(
                `${postsState.requestOptions.collectionUrlFactory()}?sort=name&pageSize=20&next%5B$or%5D%5B0%5D%5Bname%5D%5B$gt%5D=Forum%20Mannheim&next%5B$or%5D%5B1%5D%5Bname%5D%5B$gte%5D=Forum%20Mannheim&next%5B$or%5D%5B1%5D%5B_id%5D%5B$gt%5D=5e4d2901871f09a8d0fc4bef`,
            );
            expect(req2.request.method).toEqual('GET');
            req2.flush(page2Data.body, {
                headers: page2Data.headers,
            });
            expect(postsState.snapshot.ids).toEqual([1, 2, 3, 4]);
            expect(postsState.snapshot.next).toMatchInlineSnapshot(`
                Object {
                  "next[$or][0][name][$gt]": "LARI LUKE",
                  "next[$or][1][_id][$gt]": "5cffc130c82fe51c5afe0a9e",
                  "next[$or][1][name][$gte]": "LARI LUKE",
                  "pageSize": "20",
                  "sort": "name",
                }
            `);
        },
    ));

    afterEach(inject(
        [HttpTestingController],
        (httpMock: HttpTestingController) => {
            httpMock.verify();
        },
    ));
});
