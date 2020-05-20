import { Injectable } from '@angular/core';
import { HttpPaginatedCrudCollection } from '@frrri/ngxs-crud-http';
import { PaginatedCrudCollectionState } from '@frrri/ngxs-crud/pagination';

@HttpPaginatedCrudCollection({
    name: 'users',
})
@Injectable()
export class UsersState extends PaginatedCrudCollectionState<any, string> {
}
