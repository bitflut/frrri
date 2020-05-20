import { Injectable } from '@angular/core';
import { PaginatedCrudCollectionState } from '@lyxs/ngxs-crud/pagination';
import { PaginatedHttpCrudCollection } from '@lyxs/ngxs-crud-http';

@PaginatedHttpCrudCollection({
    name: 'users',
})
@Injectable()
export class UsersState extends PaginatedCrudCollectionState<any, string> {
}
