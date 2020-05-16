import { CrudEndpoint } from '../enums/crud-endpoint.enum';
import { validateService } from './validate-service';

describe('helper: validateController', () => {
    it('should throw if method missing', () => {
        class MissingMethodService { }
        const e = () => validateService(MissingMethodService, [CrudEndpoint.GetMany]);
        expect(e).toThrowErrorMatchingInlineSnapshot(
            '"Please declare `getMany()` in `MissingMethodService`"',
        );
    });

    it('should not throw if method provided', () => {
        class Service {
            getMany() { }
        }
        const e = () => validateService(Service, [CrudEndpoint.GetMany]);
        expect(e).not.toThrow();
    });
});
