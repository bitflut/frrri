import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsMiddlewareModule } from '@frrri/ngxs';
import { PaginationInterceptor } from '@frrri/ngxs/pagination';
import { FrrriModule } from '@frrri/router-middleware';
import { BreadcrumbsUiModule } from '@frrri/ui';
import { AppRoutingModule } from './app-routing.module';
import { AppStateModule } from './app-state.module';
import { AppComponent } from './app.component';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule,
        HttpClientModule,
        AppRoutingModule,
        AppStateModule,
        FrrriModule.forRoot(),
        NgxsMiddlewareModule.forRoot(),
        BreadcrumbsUiModule,
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: PaginationInterceptor,
            multi: true,
        },
    ],
    bootstrap: [AppComponent],
})
export class AppModule { }
