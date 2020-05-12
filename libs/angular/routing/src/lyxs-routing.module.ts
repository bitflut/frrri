import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RoutingNavigationService } from './routing-service/routing-navigation.service';

@NgModule({
    imports: [CommonModule],
})
export class LyxsRoutingModule {

    constructor(
        service: RoutingNavigationService,
    ) { }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LyxsRoutingModule,
            providers: [
                RoutingNavigationService,
            ],
        };
    }

}
