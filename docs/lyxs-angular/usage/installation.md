# Installation

## Getting started

Install @lyxs/angular and its peer dependencies.

```bash
# @lyxs/angular
npm install @lyxs/angular --save

# dependencies
npm install @ngxs/store @ngxs-labs/data --save
```

Then set up **ngxs/store** and **nxgs-labs/data** in `app.module.ts` like so \(see [https://www.ngxs.io/getting-started/installation](https://www.ngxs.io/getting-started/installation) for more information\):

```typescript
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { NgxsModule } from '@ngxs/store';
import { NgxsDataPluginModule } from '@ngxs-labs/data';
import { PostsState } from './posts.state'; // <-- we will add this next

@NgModule({
  imports: [
    HttpClientModule,
    NgxsModule.forRoot([PostsState], {
      developmentMode: !environment.production
    }),
    NgxsDataPluginModule.forRoot(),
  ]
})
export class AppModule {}
```

Now add a **CrudEntitiesState** \(acting as a parent to your entities\) and your first **CrudCollectionState**:

{% tabs %}
{% tab title="entities.state.ts" %}
```typescript
import { PoststState } from './posts.state';

@CrudEntities({
    name: 'entities',
    children: [PostsState]
})
export class EntitiesState extends CrudEntitiesState { }
```
{% endtab %}

{% tab title="posts.state.ts" %}
```typescript
@CrudCollection({
    name: 'posts'
})
export class PostsState extends CrudCollectionState { }
```
{% endtab %}
{% endtabs %}

In your `app.component.ts` you can retrieve data from your API:

```typescript
import { Store } from '@ngxs/store';
import { PostsState } from './posts.state';

@Component({ ... })
export class AppComponent {
  constructor(private posts: PostsState) {}

  getPosts(name: string) {
    this.posts.getMany().toPromise();
  }
}
```

{% hint style="info" %}
We recommend using [Routing Instructions](routing-instructions.md) to resolve data.
{% endhint %}

