import { Crud, Endpoint } from '@lyxs/nest-crud';
import { Controller } from '@nestjs/common';

@Crud({
    endpoints: [
        Endpoint.GetOne,
        Endpoint.PostOne,
        {
            endpoint: Endpoint.GetMany,
            query: { asdf: '123' },
        },
    ],
})
@Controller('posts')
export class PostsController { }
