import { Crud } from '@lyxs/nest';
import { Controller } from '@nestjs/common';

@Crud()
@Controller('posts')
export class PostsController { }
