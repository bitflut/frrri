import { Injectable } from '@angular/core';
import { PaginatedCollectionState } from '@frrri/ngxs/pagination';
import { HttpPaginatedCollection } from '@frrri/ngxs-http';

@HttpPaginatedCollection({
    name: 'users',
})
@Injectable()
export class UsersState extends PaginatedCollectionState<any, string> {
}
