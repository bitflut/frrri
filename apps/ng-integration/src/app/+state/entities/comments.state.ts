import { Injectable } from '@angular/core';
import { PaginatedCrudCollectionState } from '@lyxs/ngxs-crud/pagination';
import { PaginatedHttpCrudCollection } from '@lyxs/ngxs-crud-http';

@PaginatedHttpCrudCollection({
    name: 'comments',
})
@Injectable()
export class CommentsState extends PaginatedCrudCollectionState<any, string> {
}
