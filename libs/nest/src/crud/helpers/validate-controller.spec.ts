import { validateController } from './validate-controller';

describe('helper: validateController', () => {
    it('should throw if service missing', () => {
        class MissingServiceCtrl { }
        const e = () => validateController(MissingServiceCtrl);
        expect(e).toThrowErrorMatchingInlineSnapshot(
            '"Please provide a service for `MissingServiceCtrl`"',
        );
    });

    it('should not throw if service provided', () => {
        class Ctrl {
            service() { }
        }
        const e = () => validateController(Ctrl);
        expect(e).not.toThrow();
    });
});
