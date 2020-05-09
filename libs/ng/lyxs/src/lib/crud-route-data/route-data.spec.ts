import { getActive, getMany } from './route-data';

describe('routeData function', () => {
    it('should generate collection route', () => {
        const route = getMany();
        expect(route).toMatchSnapshot();
    });

    it('should generate active route', () => {
        const route = getActive();
        expect(route).toMatchSnapshot();
    });

    it('should generate collection route with parameters', () => {
        const route = getMany({
            params: {
                'filter[type][$eq]': 'comedy',
                'sort': 'startAt',
            },
        });
        expect(route).toMatchSnapshot();
    });
});
