import { Injectable } from '@angular/core';
import { AfterSuccess } from '@frrri/ngxs';
import { OperationContext } from '@frrri/ngxs/internal';
import { PaginatedCollectionState } from '@frrri/ngxs/pagination';
import { Observable } from 'rxjs';
import { HttpPaginatedCollection } from '@frrri/ngxs-http';

interface Post {
    userId: number;
    id: number;
    body: string;
    title: string;
}

@HttpPaginatedCollection({
    name: 'posts',
})
@Injectable()
export class PostsState extends PaginatedCollectionState<Post, Post['id']> implements AfterSuccess<Post> {

    afterSuccess(data: any | any[], operation: OperationContext): void | Observable<any> {
    }

}
