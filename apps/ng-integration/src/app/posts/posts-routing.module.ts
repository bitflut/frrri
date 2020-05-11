import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { clear, crudRouteInstructions, crudRoutes, deactivate, getActive, getMany, populate, PopulationStrategy } from '@lyxs/angular';
import { PostsIndexComponent } from './posts-index/posts-index.component';
import { PostsShowComponent } from './posts-show/posts-show.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'all',
    },
    {
        path: 'all',
        component: PostsIndexComponent,
        data: crudRouteInstructions({
            'entities': clear(),
            'entities.posts': [
                deactivate(),
                getMany(),
            ],
        }),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: crudRouteInstructions({
                'entities.posts': getActive(),
            }),
        }],
    },
    {
        path: 'paginated',
        component: PostsIndexComponent,
        data: crudRouteInstructions({
            'entities': clear(),
            'entities.posts': [
                deactivate(),
                getMany({ params: { _page: '1', _limit: '5' } }),
            ],
        }),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: crudRouteInstructions({
                'entities.posts': getActive(),
            }),
        }],
    },
    {
        path: 'with-comments',
        component: PostsIndexComponent,
        data: crudRouteInstructions({
            'entities': clear(),
            'entities.posts': [
                deactivate(),
                getMany({ params: { _page: '1', _limit: '5' } }),
            ],
        }),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: crudRouteInstructions({
                'entities.comments': clear(),
                'entities.posts': [
                    getActive(),
                    populate({
                        idPath: 'postId',
                        strategy: PopulationStrategy.ForeignId,
                        statePath: 'entities.comments',
                    }),
                ],
            }),
        }],
    },
    {
        path: 'with-user',
        component: PostsIndexComponent,
        data: crudRouteInstructions({
            'entities': clear(),
            'entities.posts': [
                deactivate(),
                getMany({ params: { _page: '1', _limit: '5' } }),
                populate({
                    idPath: 'userId',
                    statePath: 'entities.users',
                }),
            ],
        }),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: crudRouteInstructions({
                'entities.comments': clear(),
                'entities.posts': [
                    getActive(),
                    populate({
                        idPath: 'postId',
                        strategy: PopulationStrategy.ForeignId,
                        statePath: 'entities.comments',
                    }),
                    populate({
                        idPath: 'userId',
                        statePath: 'entities.users',
                    }),
                ],
            }),
        }],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(
            crudRoutes(routes),
        ),
    ],
    exports: [RouterModule],
})
export class PostsRoutingModule { }
