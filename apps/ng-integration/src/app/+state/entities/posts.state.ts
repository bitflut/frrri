import { Injectable } from '@angular/core';
import { AfterSuccess } from '@frrri/ngxs-crud';
import { OperationContext } from '@frrri/ngxs-crud/internal';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@frrri/ngxs-crud/pagination';
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
