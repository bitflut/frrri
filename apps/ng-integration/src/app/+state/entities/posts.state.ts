import { Injectable } from '@angular/core';
import { CrudCollection, PaginatedCrudCollectionState } from '@lyxs/angular';

@CrudCollection({
    name: 'posts',
})
@Injectable()
export class PostsState extends PaginatedCrudCollectionState<any, string> {
}
