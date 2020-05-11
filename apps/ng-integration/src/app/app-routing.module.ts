import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { crudRoutes } from '@lyxs/angular/routing';

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
            crudRoutes(routes),
            { initialNavigation: 'enabled' },
        ),
    ],
    exports: [
        RouterModule,
    ],
})
export class AppRoutingModule { }
