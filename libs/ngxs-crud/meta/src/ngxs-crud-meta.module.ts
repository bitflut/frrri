import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MetaNavigationService } from './meta-routing/meta-navigation.service';
import { MetaService } from './meta-routing/meta.service';

@NgModule({
    imports: [CommonModule],
})
export class NgxsCrudMetaModule {

    constructor(
        navigationService: MetaNavigationService,
    ) { }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxsCrudMetaModule,
            providers: [
                MetaNavigationService,
                MetaService,
            ],
        };
    }

}
