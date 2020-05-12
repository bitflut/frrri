# Routing Instructions

**@lyxs/angular/routing** aims at making it easy to configure your components data layer via the **angular router**. This way, your components are highly reusable and can display different sets of data for different routes easily.

**entities.posts** defined in the example below is the corresponding collection's state path. See [States Registry](../recipes/states-registry.md) for more information.

```typescript
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { lyxsRoutes, instructions, getActive, getMany, reset } from '@lyxs/angular/routing';

const routes: Routes = [
    {
        path: '',
        data: instructions({
            'entities': reset(), // Reset all entities when entering the route
            'entities.posts': getMany() // Then get posts
        })
    },
    {
        path: ':id',
        data: instructions({
            'entities.posts': getActive() // Get active post (defaults to set param :id active)
        })
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(
            lyxsRoutes(routes) // Important so route instructions can be resolved
        )
    ],
    exports: [RouterModule]
})
export class PostsRoutingModule { }
```

It's important to wrap the routes provided to **RouterModule** with our **lyxsRoutes\(\)** function, so our resolver will run for every route.

Have a look at [posts-routing.module.ts](https://github.com/bitflut/lyxs/blob/master/apps/ng-integration/src/app/posts/posts-routing.module.ts) in the **ng-intergation example** on GitHub for more examples.

