import { Crud } from '@lyxs/nest-crud';
import { Controller } from '@nestjs/common';

@Crud()
@Controller('posts')
export class PostsController { }
