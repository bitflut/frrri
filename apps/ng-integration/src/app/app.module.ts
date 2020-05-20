import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxsCrudBreadcrumbsModule } from '@frrri/ngxs-crud/breadcrumbs';
import { NgxsCrudMetaModule } from '@frrri/ngxs-crud/meta';
import { PaginationInterceptor } from '@frrri/ngxs-crud/pagination';
import { NgxsCrudRoutingModule } from '@frrri/ngxs-crud/routing';
import { BreadcrumbsUiModule } from '@frrri/ngxs-crud/ui';
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
        NgxsCrudMetaModule.forRoot(),
        NgxsCrudRoutingModule.forRoot(),
        NgxsCrudBreadcrumbsModule.forRoot(),
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
