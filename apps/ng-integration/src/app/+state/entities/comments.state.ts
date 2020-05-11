import { Injectable } from '@angular/core';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@lyxs/angular/pagination';

@PaginatedCrudCollection({
    name: 'comments',
})
@Injectable()
export class CommentsState extends PaginatedCrudCollectionState<any, string> {
}
