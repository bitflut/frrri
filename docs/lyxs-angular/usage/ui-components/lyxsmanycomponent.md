---
description: <lyxs-many>
---

# LyxsManyComponent

The component exposes multiple selectors and has common scenarios like loading prepared via `<ng-content>` selectors.

The path **entities.posts** defined in the example below is the corresponding collection's state path. See [States Registry](../../recipes/states-registry.md) for more information.

{% code title="posts-index.component.html" %}
```markup
<lyxs-many path="entities.posts" #posts>
    <!-- Loop through all posts -->
    <ng-container *ngFor="let post of posts.all$ | async; trackBy:posts.trackByKey('id')">
        {{ post | json }}
    </ng-container>
    
    <!-- Will be shown when loading through <ng-content select=".loading"> -->
    <div class="loading">
        Loading posts...
    </div>
</lyxs-many>
```
{% endcode %}

#### Provided &lt;ng-content&gt; selectors

{% hint style="info" %}
If the default order of these selectors is not like you wish, we suggest you use css to set lyxs-many display to flex and order the children as wanted. 
{% endhint %}

* **.loading:** Shown while the collection is loading.
* **.loading-first**: If provided, will show this instead of .loading when loading the first page of a collection.
* **.error**: Shows whenever there is an error logged in the collection's state. Shows the error in red text by default.
* **.loading-next**: Shown when loading page &gt; 1
* **.load-next**: Shown if there is a next page to load

#### Provided state selectors

* **all$**: All entities
* **loading$**: Collection is loading
* **loadingFirst$**: Collection is loading first page
* **loadingNext$**: Collection is loading next page
* **loaded$**: Collection has loaded page one
* **error$**
* **empty$**: Collection has loaded and return an empty array
* **next$**: Next url to load
* **activeId$**: The active entity's id

