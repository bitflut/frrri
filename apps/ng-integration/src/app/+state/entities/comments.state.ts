import { Injectable } from '@angular/core';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@frrri/ngxs-crud-legacy/pagination';

@PaginatedCrudCollection({
    name: 'comments',
})
@Injectable()
export class CommentsState extends PaginatedCrudCollectionState<any, string> {
}
