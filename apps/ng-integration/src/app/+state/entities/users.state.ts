import { Injectable } from '@angular/core';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@lyxs/ngxs-crud/pagination';

@PaginatedCrudCollection({
    name: 'users',
})
@Injectable()
export class UsersState extends PaginatedCrudCollectionState<any, string> {
}
