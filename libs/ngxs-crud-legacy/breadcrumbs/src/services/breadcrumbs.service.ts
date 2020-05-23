import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { CrudCollectionState } from '@frrri/ngxs-crud';
import { StatesRegistryService } from '@frrri/ngxs-crud/registry';
import { EMPTY, Subject } from 'rxjs';
import { catchError, filter, take, timeout } from 'rxjs/operators';
import { BREADCRUMBS_INSTRUCTION } from '../constants';
import { BreadcrumbsInstructionType } from '../enums/breadcrumbs-instruction.enum';
import { ActiveBreadcrumb } from '../instructions/breadcrumbs.instruction';

@Injectable()
export class BreadcrumbsService {

    private activeId$$ = new Subject();
    activeId$ = this.activeId$$.asObservable();

    private all$$ = new Subject();
    all$ = this.all$$.asObservable();

    protected registryService = this.injector.get(StatesRegistryService);

    constructor(protected injector: Injector) { }

    async update(route: ActivatedRouteSnapshot) {
        const breadcrumbsMap: { [key: string]: any } = {};

        let currentRoute = route;
        while (currentRoute) {
            const crumb = currentRoute.data[BREADCRUMBS_INSTRUCTION];
            if (crumb) {
                breadcrumbsMap[`${crumb.type} ${crumb.id}`] = {
                    ...crumb,
                    url: '/' + currentRoute.pathFromRoot.map(r => r.url[0]?.path).filter(url => !!url).join('/'),
                };
            }
            currentRoute = currentRoute.parent;
        }

        const breadcrumbs = await Promise.all([
            ...Object.values(breadcrumbsMap).map(c => {
                switch (c.type) {
                    case BreadcrumbsInstructionType.Static:
                        return c;
                    case BreadcrumbsInstructionType.Active:
                        return this.activeBreadcrumbToStatic(c);
                }
            }),
        ]);

        this.all$$.next(breadcrumbs.reverse());
        this.activeId$$.next(breadcrumbs[0].id);
    }

    private async activeBreadcrumbToStatic(breadcrumb: ActiveBreadcrumb) {
        const facade = this.registryService.getByPath<CrudCollectionState>(breadcrumb.statePath);
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
