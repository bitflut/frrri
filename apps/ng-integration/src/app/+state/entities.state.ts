import { Injectable } from '@angular/core';
import { CrudEntities, CrudEntitiesState } from '@lyxs/angular';
import { CommentsState } from './entities/comments.state';
import { PostsState } from './entities/posts.state';
import { UsersState } from './entities/users.state';

@CrudEntities({
    name: 'entities',
    children: [
        PostsState,
        CommentsState,
        UsersState,
    ],
})
@Injectable()
export class EntitiesState extends CrudEntitiesState<any> { }
