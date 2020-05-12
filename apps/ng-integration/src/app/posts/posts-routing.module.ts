import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { activeMeta, staticMeta } from '@lyxs/angular/meta';
import { deactivate, getActive, getMany, instructions, lyxsRoutes, populate, PopulationStrategy, reset } from '@lyxs/angular/routing';
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
        data: {
            ...instructions({
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
            ...staticMeta({
                title: 'Posts with user',
            }),
        },
        children: [{
            path: ':id',
            component: PostsShowComponent,
            data: {
                ...instructions({
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
                ...activeMeta({
                    statePath: 'entities.posts',
                    factory: data => {
                        return {
                            title: `THE POST - ${data.title}`,
                        };
                    },
                }),
            },
        }],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(
            lyxsRoutes(routes),
        ),
    ],
    exports: [RouterModule],
})
export class PostsRoutingModule { }
