import { Crud, Endpoint } from '@lyxs/nest-crud';
import { Controller } from '@nestjs/common';

@Crud({
    endpoints: [
        {
            endpoint: Endpoint.GetMany,
            query: { asdf: '123' },
        },
    ],
})
@Controller('posts')
export class PostsController { }
