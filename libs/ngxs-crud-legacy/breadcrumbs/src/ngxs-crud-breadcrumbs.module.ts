import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { BreadcrumbsNavigationService } from './services/breadcrumbs-navigation.service';
import { BreadcrumbsService } from './services/breadcrumbs.service';

@NgModule({
    imports: [CommonModule],
})
export class NgxsCrudBreadcrumbsModule {

    constructor(
        navigationService: BreadcrumbsNavigationService,
    ) { }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxsCrudBreadcrumbsModule,
            providers: [
                BreadcrumbsNavigationService,
                BreadcrumbsService,
            ],
        };
    }

}
