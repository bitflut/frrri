import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { activeBreadcrumb, OperatorType } from '@frrri/router-middleware/operators';
import { EMPTY, Subject } from 'rxjs';
import { catchError, filter, take, timeout } from 'rxjs/operators';
import { FRRRI_OPERATIONS, FRRRI_STATE_REGISTRY } from '../constants';
import { NavigationEndPlatform } from '../platforms/navigation-end.platform';

@Injectable()
export class BreadcrumbsService extends NavigationEndPlatform {

    private activeId$$ = new Subject();
    activeId$ = this.activeId$$.asObservable();

    private all$$ = new Subject();
    all$ = this.all$$.asObservable();

    protected registryService = this.injector.get(FRRRI_STATE_REGISTRY);

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const breadcrumbsMap: { [key: string]: any } = {};

        let currentRoute = route;
        while (currentRoute) {
            const operation = currentRoute.data[FRRRI_OPERATIONS]
                ?.filter(o => [OperatorType.ActiveBreadcrumb, OperatorType.StaticBreadcrumb].includes(o.type))
                ?.[0];

            if (operation) {
                breadcrumbsMap[`${operation.type} ${operation.id}`] = {
                    ...operation,
                    url: '/' + currentRoute.pathFromRoot.map(r => r.url[0]?.path).filter(url => !!url).join('/'),
                };
            }

            currentRoute = currentRoute.parent;
        }

        const breadcrumbs = await Promise.all([
            ...Object.values(breadcrumbsMap).map(c => {
                switch (c.type) {
                    case OperatorType.StaticBreadcrumb:
                        return c;
                    case OperatorType.ActiveBreadcrumb:
                        return this.activeBreadcrumbToStatic(c);
                }
            }),
        ]);

        this.all$$.next(breadcrumbs.reverse());
        this.activeId$$.next(breadcrumbs[0].id);
    }

    private async activeBreadcrumbToStatic(breadcrumb: ReturnType<typeof activeBreadcrumb>) {
        const facade = this.registryService.getByPath(breadcrumb.statePath);
        const active = await facade.active$
            .pipe(
                timeout(12000),
                filter(a => !!a),
                take(1),
                catchError(e => {
                    console.error(e);
                    console.warn(`TIMEOUT ERROR: Could not find active entity in \`${breadcrumb.statePath}\` within timeout. Did you forget to use getActive in your routing instructions?`);
                    return EMPTY;
                }),
            ).toPromise();

        return breadcrumb.factory(active);
    }

}
