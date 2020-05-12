# LyxsActiveComponent

Display's the currently active entity of a collection

The path **entities.posts** defined in the example below is the corresponding collection's state path. See [States Registry](../../recipes/states-registry.md) for more information.

{% code title="posts-show.component.html" %}
```markup
<lyxs-active path="entities.posts" #activePostComponent>
    <ng-container *ngIf="activePostComponent.active$ | async as post">
        <div>#{{ post.id }} {{ post.title }}</div>
        <div>{{ post.body }}</div>
    </ng-container>

    <div class="loading">
        LOADING...
    </div>
</lyxs-active>
```
{% endcode %}



