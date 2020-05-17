import { ParsedRequest } from '@lyxs/nest/common';
import { Controller, HttpModule } from '@nestjs/common';
import { NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import * as supertest from 'supertest';
import { Crud } from '../decorators/crud.decorator';
import { CrudEndpoint } from '../enums/crud-endpoint.enum';
import { CrudController } from '../interfaces/crud-controller.interface';
import { CrudDecoratorOptions } from '../interfaces/crud-decorator-options.interface';
import { CrudService } from '../interfaces/crud-service.interface';
import { IdType } from '../types/id.type';

interface Post {
    id: number;
    userId: number;
    body: string;
    title: string;
}

class PostsService implements CrudService<Post> {

    data: { [key: number]: Post } = {
        1: {
            'body': 'quia et suscipit suscipit recusandae consequuntur expedita et cum reprehenderit molestiae ut ut quas totam nostrum rerum est autem sunt rem eveniet architecto',
            'id': 1,
            'title': 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
            'userId': 1,
        },
        2: {
            'body': 'est rerum tempore vitae sequi sint nihil reprehenderit dolor beatae ea dolores neque fugiat blanditiis voluptate porro vel nihil molestiae ut reiciendis qui aperiam non debitis possimus qui neque nisi nulla',
            'id': 2,
            'title': 'qui est esse',
            'userId': 1,
        },
        3: {
            'body': 'et iusto sed quo iure voluptatem occaecati omnis eligendi aut ad voluptatem doloribus vel accusantium quis pariatur molestiae porro eius odio et labore et velit aut',
            'id': 3,
            'title': 'ea molestias quasi exercitationem repellat qui ipsa sit aut',
            'userId': 1,
        },
    };

    getMany(req: ParsedRequest) {
        return Object.values(this.data);
    }

    getOne(req: ParsedRequest, id: IdType) {
        return this.data[id];
    }

}

describe('CrudRequestInterceptor', () => {
    let $: supertest.SuperTest<supertest.Test>;
    let app: NestApplication;

    const conditions = {} as CrudDecoratorOptions['query'];
    const endpoints = [CrudEndpoint.GetMany, CrudEndpoint.GetOne] as CrudDecoratorOptions['endpoints'];
    @Crud({ query: conditions, endpoints })
    @Controller('posts')
    class PostsController implements CrudController<Post> {
        constructor(public service: PostsService) { }
    }

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [HttpModule],
            controllers: [PostsController],
            providers: [PostsService],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
        $ = supertest(app.getHttpServer());
    });

    it('should be provided', async () => {
        const getMany = await $.get('/posts').expect(200);
        expect(getMany.body).toMatchSnapshot('getMany()');
        const getOne1 = await $.get('/posts/1').expect(200);
        expect(getOne1.body).toMatchSnapshot('getOne(1)');
        expect(getOne1.body.id).toEqual(1);
        const getOne2 = await $.get('/posts/2').expect(200);
        expect(getOne2.body).toMatchSnapshot('getOne(2)');
        expect(getOne2.body.id).toEqual(2);
    });

    afterAll(async () => {
        await app.close();
    });

});
