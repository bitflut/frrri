import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudCollectionService } from '@frrri/ngxs-crud';
import { HttpCrudCollectionService } from './http-crud-collection.service';
import { HttpPaginatedCrudCollectionService } from './http-paginated-crud-collection.service';
import { PaginatedCrudCollectionService } from '@frrri/ngxs-crud/pagination';

export const PAGINATED_HTTP_CRUD_COLLECTION_SERVICE =
    new InjectionToken<PaginatedCrudCollectionService>('PAGINATED_HTTP_CRUD_COLLECTION_SERVICE_TOKEN');

export const HTTP_CRUD_COLLECTION_SERVICE =
    new InjectionToken<CrudCollectionService>('HTTP_CRUD_COLLECTION_SERVICE_TOKEN');


@NgModule({
    imports: [CommonModule],
})
export class NgxsHttpCrudCollectionModule {

    constructor(
    ) { }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxsHttpCrudCollectionModule,
            providers: [
                {
                    provide: PAGINATED_HTTP_CRUD_COLLECTION_SERVICE,
                    useClass: HttpPaginatedCrudCollectionService,
                },
                {
                    provide: HTTP_CRUD_COLLECTION_SERVICE,
                    useClass: HttpCrudCollectionService,
                },
            ],
        };
    }
}
