import { Injectable } from '@angular/core';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@lyxs/angular/pagination';

@PaginatedCrudCollection({
    name: 'posts',
})
@Injectable()
export class PostsState extends PaginatedCrudCollectionState<any, string> {
}
