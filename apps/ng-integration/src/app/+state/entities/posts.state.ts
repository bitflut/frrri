import { Injectable } from '@angular/core';
import { CrudCollection, PaginatedCrudCollectionState } from '@lyxs/ng/lyxs';

@CrudCollection({
    name: 'posts',
})
@Injectable()
export class PostsState extends PaginatedCrudCollectionState<any, string> {
}
