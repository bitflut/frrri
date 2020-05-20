import { NgModule, ModuleWithProviders, InjectionToken } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CrudCollectionService } from '@lyxs/ngxs-crud';
import { HttpCrudCollectionService } from './http-crud-collection.service';
import { PaginatedHttpCrudCollectionService } from './paginated-http-crud-collection.service';

export const PAGINATED_HTTP_CRUD_COLLECTION_SERVICE =
    new InjectionToken<CrudCollectionService>('PAGINATED_HTTP_CRUD_COLLECTION_SERVICE_TOKEN');

export const HTTP_CRUD_COLLECTION_SERVICE =
    new InjectionToken<CrudCollectionService>('HTTP_CRUD_COLLECTION_SERVICE_TOKEN');


@NgModule({
    imports: [CommonModule],
})
export class HttpCrudCollectionModule {

    constructor(
    ) { }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: HttpCrudCollectionModule,
            providers: [
                {
                    provide: PAGINATED_HTTP_CRUD_COLLECTION_SERVICE,
                    useClass: PaginatedHttpCrudCollectionService,
                },
                {
                    provide: HTTP_CRUD_COLLECTION_SERVICE,
                    useClass: HttpCrudCollectionService,
                },
            ],
        };
    }
}
