import { Injectable } from '@angular/core';
import { Cache, CacheState } from '@lyxs/angular';
import { CommentsState } from './entities/comments.state';
import { PostsState } from './entities/posts.state';
import { UsersState } from './entities/users.state';

@Cache({
    name: 'entities',
    children: [
        PostsState,
        CommentsState,
        UsersState,
    ],
})
@Injectable()
export class EntitiesState extends CacheState<any> { }
