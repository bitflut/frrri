import { ClassType } from '@lyxs/nest-crud/internal';
import { Controller } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { CrudEndpoint } from '../enums/crud-endpoint.enum';
import { CrudDecoratorOptions } from '../interfaces/crud-decorator-options.interface';
import { Crud } from './crud.decorator';

class Dto { }
class PostDto { }
class PatchDto { }

describe('@Crud', () => {

    it('should compile with defaults', () => {
        @Crud()
        @Controller()
        class Ctrl { }

        // Compiles successfully
        expect(Ctrl).toBeDefined();

        // Defines all endpoints
        for (const endpoint of Object.values(CrudEndpoint)) {
            expect(Ctrl.prototype[endpoint]).toBeDefined();
        }
    });

    it('should provide certain endpoints', () => {
        const endpoints = [CrudEndpoint.GetMany, CrudEndpoint.GetOne] as CrudDecoratorOptions['endpoints'];

        @Crud({ endpoints })
        @Controller()
        class Ctrl { }

        // Defines endpoints provided
        for (const endpoint of endpoints) {
            expect(Ctrl.prototype[endpoint as CrudEndpoint]).toBeDefined();
        }

        // Does not define any unprovided endpoints
        expect(Ctrl.prototype[CrudEndpoint.DeleteOne]).not.toBeDefined();
    });

    it('should use dto', () => {
        @Crud({ dto: Dto })
        @Controller()
        class Ctrl { }

        const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', Ctrl.prototype, CrudEndpoint.PostOne);
        const isPostDtoDefined = paramTypes.findIndex(t => t === Dto) > -1;
        expect(isPostDtoDefined).toBeTruthy();
    });

    it('should set custom dtos alongside default dto', () => {
        @Crud({
            endpoints: [
                CrudEndpoint.PutOne,
                {
                    endpoint: CrudEndpoint.PostOne,
                    dto: PostDto,
                },
                {
                    endpoint: CrudEndpoint.PatchOne,
                    dto: PatchDto,
                },
            ],
            dto: Dto,
        })
        @Controller()
        class Ctrl { }

        const validateDto = (endpoint: CrudEndpoint, dto: ClassType) => {
            const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', Ctrl.prototype, endpoint) || [];
            const isDtoDefined = paramTypes.findIndex(t => t === dto) > -1;
            expect(isDtoDefined).toBeTruthy();
        };

        validateDto(CrudEndpoint.PutOne, Dto);
        validateDto(CrudEndpoint.PatchOne, PatchDto);
        validateDto(CrudEndpoint.PostOne, PostDto);
    });

    it('should set provided id type', () => {
        @Crud({ idType: ObjectId })
        @Controller()
        class Ctrl { }

        const paramTypes: any[] = Reflect.getMetadata('design:paramtypes', Ctrl.prototype, CrudEndpoint.GetOne);
        const isIdTypeDefined = paramTypes.findIndex(t => t === ObjectId) > -1;
        expect(isIdTypeDefined).toBeTruthy();
    });

});
