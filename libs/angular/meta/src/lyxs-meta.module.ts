import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { MetaNavigationService } from './meta-routing/meta-navigation.service';
import { MetaService } from './meta-routing/meta.service';

@NgModule({
    imports: [CommonModule],
})
export class LyxsMetaModule {

    constructor(
        navigationService: MetaNavigationService,
        metaService: MetaService,
    ) { }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LyxsMetaModule,
            providers: [
                MetaNavigationService,
                MetaService,
            ],
        };
    }

}
