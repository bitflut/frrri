import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { LyxsMetaModule } from '@lyxs/ngxs-crud/meta';
import { PaginationInterceptor } from '@lyxs/ngxs-crud/pagination';
import { LyxsRoutingModule } from '@lyxs/ngxs-crud/routing';
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
        LyxsMetaModule.forRoot(),
        LyxsRoutingModule.forRoot(),
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
