import { Injectable } from '@angular/core';
import { PaginatedHttpCrudCollection } from '@frrri/ngxs-crud-http';
import { PaginatedCrudCollectionState } from '@frrri/ngxs-crud/pagination';

@PaginatedHttpCrudCollection({
    name: 'users',
})
@Injectable()
export class UsersState extends PaginatedCrudCollectionState<any, string> {
}
