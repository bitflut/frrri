import { Crud, CrudMethod } from '@lyxs/nest';
import { Controller } from '@nestjs/common';

@Controller('posts')
@Crud({
    methods: [
        CrudMethod.GetMany,
        CrudMethod.GetOne,
    ],
})
export class PostsController { }
