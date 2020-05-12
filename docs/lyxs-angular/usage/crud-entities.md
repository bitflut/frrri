# Crud Entities

LYXS is designed to cache a copy of all entities needed by your current route to render. In order to decouple all actions from the rest of your reducers, **we strongly suggest you give your CrudCollections a parent state extending** **CrudEntities**.

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

This enables resetting all your children's states at once by calling `EntitiesState.reset()` .

### State paths

In the example code above, the path of **PostsState** will be `entities.posts` because it is a child of the **EntitiesState**. See [States Registry](../recipes/states-registry.md) for more information.





