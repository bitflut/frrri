import { Injectable } from '@angular/core';
import { AfterSuccess } from '@lyxs/ngxs-crud';
import { OperationContext } from '@lyxs/ngxs-crud/internal';
import { PaginatedCrudCollectionState } from '@lyxs/ngxs-crud/pagination';
import { Observable } from 'rxjs';
import { PaginatedHttpCrudCollection } from '@lyxs/ngxs-crud-http';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@PaginatedHttpCrudCollection({
    name: 'posts',
})
@Injectable()
export class PostsState extends PaginatedCrudCollectionState<Post, Post['id']> implements AfterSuccess<Post> {

    afterSuccess(data: any | any[], operation: OperationContext): void | Observable<any> {
    }

}
