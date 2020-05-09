import { Injectable } from '@angular/core';
import { CrudCollection, PaginatedCrudCollectionState } from '@lyxs/ng/lyxs';

@CrudCollection({
    name: 'users',
})
@Injectable()
export class UsersState extends PaginatedCrudCollectionState<any, string> {
}
