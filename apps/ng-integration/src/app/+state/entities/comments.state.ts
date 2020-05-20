import { Injectable } from '@angular/core';
import { PaginatedCrudCollectionState } from '@frrri/ngxs-crud/pagination';
import { PaginatedHttpCrudCollection } from '@frrri/ngxs-crud-http';

@PaginatedHttpCrudCollection({
    name: 'comments',
})
@Injectable()
export class CommentsState extends PaginatedCrudCollectionState<any, string> {
}
