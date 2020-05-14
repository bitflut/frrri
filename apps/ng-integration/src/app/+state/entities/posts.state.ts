import { Injectable } from '@angular/core';
import { AfterSuccess } from '@lyxs/angular';
import { OperationContext } from '@lyxs/angular/internal';
import { PaginatedCrudCollection, PaginatedCrudCollectionState } from '@lyxs/angular/pagination';
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
