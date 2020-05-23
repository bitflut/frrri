import { Injectable } from '@angular/core';
import { AfterSuccess } from '@frrri/ngxs-crud-legacy';
import { OperationContext } from '@frrri/ngxs/internal';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@frrri/ngxs/pagination';
import { Observable } from 'rxjs';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@PaginatedCrudCollection({
    name: 'posts',
})
@Injectable()
export class PostsState extends PaginatedCrudCollectionState<Post, Post['id']> implements AfterSuccess<Post> {

    afterSuccess(data: any | any[], operation: OperationContext): void | Observable<any> {
    }

}
