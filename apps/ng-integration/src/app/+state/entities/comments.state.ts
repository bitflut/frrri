import { Injectable } from '@angular/core';
import { PaginatedCrudCollectionState } from '@frrri/ngxs-crud/pagination';
import { HttpPaginatedCrudCollection } from '@frrri/ngxs-crud-http';

@HttpPaginatedCrudCollection({
    name: 'comments',
})
@Injectable()
export class CommentsState extends PaginatedCrudCollectionState<any, string> {
}
