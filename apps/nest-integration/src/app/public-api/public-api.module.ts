import { Module } from '@nestjs/common';
import { CommentsModule } from './comments/comments.module';
import { PostsModule } from './posts/posts.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [PostsModule, UsersModule, CommentsModule]
})
export class PublicApiModule { }
