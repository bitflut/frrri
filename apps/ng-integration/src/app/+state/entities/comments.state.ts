import { Injectable } from '@angular/core';
import { PaginatedCollectionState } from '@frrri/ngxs/pagination';
import { HttpPaginatedCollection } from '@frrri/ngxs-http';

@HttpPaginatedCollection({
    name: 'comments',
})
@Injectable()
export class CommentsState extends PaginatedCollectionState<any, string> {
}
