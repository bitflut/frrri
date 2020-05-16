import { HttpModule } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { Crud } from './crud.decorator';
import { CrudEndpoint } from './enums/crud-endpoint.enum';
import { CrudController } from './interfaces/crud-controller.interface';
import { CrudDecoratorOptions } from './interfaces/crud-decorator-options.interface';
import { JsonServerOptions, JsonServerService } from './testing/json-server.service';

jest.mock('./helpers/validate-service.ts');
jest.mock('./helpers/validate-controller.ts');

describe('@Crud', () => {

    it('should compile with defaults', () => {
        @Crud()
        class Ctrl { }

        // Compiles successfully
        expect(Ctrl).toBeDefined();

        // Defines all endpoints
        for (const endpoint of Object.values(CrudEndpoint)) {
            expect(Ctrl.prototype[endpoint]).toBeDefined();
        }
    });

    it('should compile with certain endpoints', () => {
        const endpoints = [CrudEndpoint.GetMany, CrudEndpoint.GetOne] as CrudDecoratorOptions['endpoints'];

        @Crud({ endpoints })
        class Ctrl { }

        // Defines endpoints provided
        for (const endpoint of endpoints) {
            expect(Ctrl.prototype[endpoint]).toBeDefined();
        }

        // Does not define any unprovided endpoints
        expect(Ctrl.prototype[CrudEndpoint.DeleteOne]).not.toBeDefined();
    });

    it('should allow static conditions', async () => {
        interface Post {
            id: number;
            userId: number;
            body: string;
            title: string;
        }

        const collection = 'posts';
        @JsonServerOptions({ collection })
        class PostsService extends JsonServerService<Post> { }

        const conditions = {} as CrudDecoratorOptions['conditions'];
        const endpoints = [CrudEndpoint.GetMany, CrudEndpoint.GetOne] as CrudDecoratorOptions['endpoints'];
        @Crud({ conditions, endpoints })
        class PostsController implements CrudController<Post> {
            constructor(public service: PostsService) { }
        }

        const moduleRef = await Test.createTestingModule({
            imports: [HttpModule],
            controllers: [PostsController],
            providers: [PostsService],
        }).compile();

        const postsController = moduleRef.get(PostsController);
        const postsService = moduleRef.get(PostsService);

        expect(postsController).toBeDefined();
        expect(postsService).toBeDefined();

        const response = await postsService.getMany().toPromise();
        expect(response).toMatchSnapshot('get-many');
    });

});
