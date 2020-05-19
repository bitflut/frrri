import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ngxsCrudRoutes } from '@frrri/ngxs-crud/routing';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'posts',
                loadChildren: () => import('./posts/posts.module').then(m => m.PostsModule),
            },
        ],
    },
];

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        RouterModule.forRoot(
            ngxsCrudRoutes(routes),
            {
                initialNavigation: 'enabled',
                urlUpdateStrategy: 'eager',
            },
        ),
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRoutingModule { }
