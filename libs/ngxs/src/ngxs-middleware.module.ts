import { CommonModule } from '@angular/common';
import { Injector, ModuleWithProviders, NgModule } from '@angular/core';
import { FRRRI_MIDDLEWARE, FRRRI_STATE_REGISTRY } from '@frrri/router-middleware';
import { NgxsNavigationEndMiddleware } from './libs/middlewares/ngxs.navigation-end-middleware';
import { NgxsResolverMiddleware } from './libs/middlewares/ngxs.resolver-middleware';
import { StatesRegistryService } from './libs/states-registry/states-registry.service';

@NgModule({
    imports: [CommonModule],
})
export class NgxsMiddlewareModule {

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgxsMiddlewareModule,
            providers: [
                {
                    provide: FRRRI_STATE_REGISTRY,
                    useClass: StatesRegistryService,
                    deps: [Injector],
                },
                {
                    provide: FRRRI_MIDDLEWARE,
                    multi: true,
                    useClass: NgxsResolverMiddleware,
                    deps: [Injector],
                },
                {
                    provide: FRRRI_MIDDLEWARE,
                    multi: true,
                    useClass: NgxsNavigationEndMiddleware,
                    deps: [Injector],
                },
            ],
        };
    }

}
