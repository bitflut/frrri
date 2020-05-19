import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { activeMeta, staticMeta } from '@frrri/ngxs-crud/meta';
import { populate, PopulationStrategy } from '@frrri/ngxs-crud/populate';
import { compose, deactivate, getActive, getMany, instructions, ngxsCrudRoutes, reset } from '@frrri/ngxs-crud/routing';
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
        data: instructions({
            'entities': reset(),
            'entities.posts': [
                deactivate(),
                getMany(),
            ],
        }),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: instructions({
                'entities.posts': getActive(),
            }),
        }],
    },
    {
        path: 'await',
        component: PostsIndexComponent,
        data: instructions({
            'entities': reset(),
            'entities.posts': [
                deactivate(),
                getMany({ await: true }),
            ],
        }),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: instructions({
                'entities.posts': getActive({ await: true }),
            }),
        }],
    },
    {
        path: 'paginated',
        component: PostsIndexComponent,
        data: instructions({
            'entities': reset(),
            'entities.posts': [
                deactivate(),
                getMany({ params: { _page: '1', _limit: '5' } }),
            ],
        }),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: instructions({
                'entities.posts': getActive(),
            }),
        }],
    },
    {
        path: 'with-comments',
        component: PostsIndexComponent,
        data: instructions({
            'entities': reset(),
            'entities.posts': [
                deactivate(),
                getMany({ params: { _page: '1', _limit: '5' } }),
            ],
        }),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: instructions({
                'entities.comments': reset(),
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
        data: compose(
            instructions({
                'entities': reset(),
                'entities.posts': [
                    deactivate(),
                    getMany({ params: { _page: '1', _limit: '5' } }),
                    populate({
                        idPath: 'userId',
                        statePath: 'entities.users',
                    }),
                ],
            }),
            staticMeta({
                title: 'Posts with user',
            }),
        ),
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: compose(
                instructions({
                    'entities.comments': reset(),
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
                activeMeta({
                    statePath: 'entities.posts',
                    factory: data => ({
                        title: data.title,
                    }),
                }),
            ),
        }],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(
            ngxsCrudRoutes(routes),
        ),
    ],
    exports: [RouterModule],
})
export class PostsRoutingModule { }
