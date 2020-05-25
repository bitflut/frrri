import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpCrudCollectionService } from './http-crud-collection.service';
import { HttpPaginatedCrudCollectionService } from './http-paginated-crud-collection.service';

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
                HttpCrudCollectionService,
                HttpPaginatedCrudCollectionService,
            ],
        };
    }
}
