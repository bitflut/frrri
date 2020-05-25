import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { NgxsModule } from '@ngxs/store';
import { PaginationInterceptor, PaginatedCrudCollectionReducer, PaginatedCrudCollectionState } from '@frrri/ngxs-crud/pagination';
import { CrudCollectionReducer, CurdCollectionStateOptions } from '@frrri/ngxs-crud';
import { PaginatedCrudCollectionOptions } from './paginated-crud-collection-options.interface';
import { TestCrudCollection, TestCrudCollectionService } from '../../../src/crud-collection-state/crud-collection.state.spec';
import { StateClass } from '@ngxs/store/internals';
import { PaginatedCrudCollectionService } from './paginated-crud-collection-service.interface';
import { GetManyOptions } from '@frrri/ngxs-crud/internal';
import { Observable, of } from 'rxjs';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

export function TestPaginatedCrudCollection<T = CrudCollectionReducer>(options: PaginatedCrudCollectionOptions<T>) {
    options = {
        ...options,
        defaults: {
            next: undefined,
            ...options.defaults,
        },
    };

    const crudCollectionFn = TestCrudCollection(options);
    return function (target: StateClass) {
        target.prototype.pageSize = options.size;
        target.prototype.paginatedServiceToken = TestPaginatedCrudService;
        crudCollectionFn(target);
    };
}

@Injectable()
export class TestPaginatedCrudService<V = any> implements PaginatedCrudCollectionService<V> {
    getMany(stateOptions: CurdCollectionStateOptions, options: GetManyOptions & { size?: number } = {}) { return of([]); }
    getAll(stateOptions: CurdCollectionStateOptions, options: GetManyOptions & { size?: number } = {}): Observable<V[]> { return of([]); }
    getNext(url: any) { return of([]); }
}

@TestPaginatedCrudCollection<PaginatedCrudCollectionReducer>({
    name: 'post',
})
@Injectable()
class PostsEntitiesState extends PaginatedCrudCollectionState<Post, number> { }

describe('PaginatedCollectionState', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                NgxsDataPluginModule.forRoot(),
                NgxsModule.forRoot([PostsEntitiesState]),
                HttpClientModule,
            ],
            providers: [
                {
                    provide: HTTP_INTERCEPTORS,
                    multi: true,
                    useClass: PaginationInterceptor,
                },
                TestPaginatedCrudService,
                TestCrudCollectionService,
            ],
        }).compileComponents();
    });

    it('should getMany', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
    ], (
        postsState: PostsEntitiesState,
        service: TestPaginatedCrudService,
    ) => {
        expect(postsState.paginatedServiceToken).toBeDefined();
        expect(postsState.serviceToken).toBeDefined();
        expect(postsState.stateOptions).toBeDefined();
        const spy = spyOn(service, 'getMany').and.callThrough();
        postsState.getMany().toPromise();
        expect(spy).toHaveBeenCalledTimes(1);
    },
    ));

    it('should getAll', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
    ], (
        postsState: PostsEntitiesState,
        service: TestPaginatedCrudService,
    ) => {
        const spy = spyOn(service, 'getAll').and.callThrough();
        postsState.getAll().toPromise();
        expect(spy).toHaveBeenCalledTimes(1);
    },
    ));

    it('should getNext', inject([
        PostsEntitiesState,
        TestPaginatedCrudService,
    ], (
        postsState: PostsEntitiesState,
        service: TestPaginatedCrudService,
    ) => {
        const spy = spyOn(service, 'getNext').and.callThrough();
        postsState.getNext().toPromise();
        expect(spy).toHaveBeenCalledTimes(1);
    },
    ));

});
