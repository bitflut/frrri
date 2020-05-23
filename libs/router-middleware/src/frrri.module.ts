import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { NavigationEndPlatform } from './platforms/navigation-end.platform';
import { ResolverPlatform } from './platforms/resolver.platform';
import { BreadcrumbsService } from './services/breadcrumbs.service';

@NgModule({
    imports: [CommonModule],
})
export class FrrriModule {

    constructor(
        navigationEndPlatform: NavigationEndPlatform,
        breadcrumbsService: BreadcrumbsService,
    ) { }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: FrrriModule,
            providers: [
                NavigationEndPlatform,
                ResolverPlatform,
                BreadcrumbsService,
            ],
        };
    }

}
