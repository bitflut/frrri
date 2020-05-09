import { Injectable } from '@angular/core';
import { CrudCollection, PaginatedCrudCollectionState } from '@lyxs/ng/lyxs';

@CrudCollection({
    name: 'comments',
})
@Injectable()
export class CommentsState extends PaginatedCrudCollectionState<any, string> {
}
