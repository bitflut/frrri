import { Injectable } from '@angular/core';
import { CrudCollection, PaginatedCrudCollectionState } from '@lyxs/angular';

@CrudCollection({
    name: 'comments',
})
@Injectable()
export class CommentsState extends PaginatedCrudCollectionState<any, string> {
}
