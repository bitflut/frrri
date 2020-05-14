import { Crud } from '@lyxs/nest';
import { Controller } from '@nestjs/common';

@Controller('posts')
@Crud({
    methods: ['getMany', 'getOne', 'updateOne', 'createOne', 'deleteOne'],
})
export class PostsController { }
