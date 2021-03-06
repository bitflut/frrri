# Crud Collection

By extending your State with **CollectionState** and adding the **@CrudCollection** decorator, you are all set to communicate with your api via the provided defaults `/api/{collection name}` .

{% code title="posts.state.ts" %}
```typescript
import { Injectable } from '@angular/core';
import { CrudCollection, CollectionState } from '@frrri/ngxs-crud';

interface Post {
    id: string;
    body: string;
    title: string;
}

@CrudCollection({ name: 'posts' })
@Injectable()
export class PostsState extends CollectionState<Post, Post['id']> { }

```
{% endcode %}

### Global customisation

You can fully customise the baseUrl, endpoint and other relevant things via the **@CrudCollection** decorator's options, or globally for all collections by providing **CRUD\_COLLECTION\_OPTIONS\_TOKEN** anywhere in your module.

Overriding defaults for every **@CrudCollection** globally:

{% code title="state.module.ts" %}
```typescript
...
@NgModule({
    ...
    providers: [
        ...
        {
            provide: CRUD_COLLECTION_OPTIONS_TOKEN,
            useValue: {
                baseUrl: 'http://localhost:3000',
            } as CrudCollectionOptionsProvider,
        }
    ],
})
export class StateModule { }
```
{% endcode %}

