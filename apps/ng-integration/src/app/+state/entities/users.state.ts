import { Injectable } from '@angular/core';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@lyxs/angular/pagination';

@PaginatedCrudCollection({
    name: 'users',
})
@Injectable()
export class UsersState extends PaginatedCrudCollectionState<any, string> {
}
