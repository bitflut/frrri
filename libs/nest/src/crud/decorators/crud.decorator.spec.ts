import { Controller } from '@nestjs/common';
import { CrudEndpoint } from '../enums/crud-endpoint.enum';
import { CrudDecoratorOptions } from '../interfaces/crud-decorator-options.interface';
import { Crud } from './crud.decorator';

interface Post {
    id: number;
    userId: number;
    body: string;
    title: string;
}

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

    it('should compile with certain endpoints', () => {
        const endpoints = [CrudEndpoint.GetMany, CrudEndpoint.GetOne] as CrudDecoratorOptions['endpoints'];

        @Crud({ endpoints })
        @Controller()
        class Ctrl { }

        // Defines endpoints provided
        for (const endpoint of endpoints) {
            expect(Ctrl.prototype[endpoint]).toBeDefined();
        }

        // Does not define any unprovided endpoints
        expect(Ctrl.prototype[CrudEndpoint.DeleteOne]).not.toBeDefined();
    });

});
