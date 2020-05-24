import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CrudCollectionState } from '@frrri/ngxs';
import { activeMeta, OperatorType } from '@frrri/router-middleware/operators';
import { EMPTY } from 'rxjs';
import { catchError, filter, take, timeout } from 'rxjs/operators';
import { FRRRI_OPERATIONS, FRRRI_STATE_REGISTRY } from '../constants';
import { NavigationEndPlatform } from '../platforms/navigation-end.platform';

@Injectable()
export class MetaService extends NavigationEndPlatform {

    protected registryService = this.injector.get(FRRRI_STATE_REGISTRY);
    protected metaService = this.injector.get(Meta);
    protected titleService = this.injector.get(Title);
    private defaultTitle = this.titleService.getTitle();

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const operation = route.data[FRRRI_OPERATIONS]
            ?.filter(o => [OperatorType.ActiveMeta, OperatorType.StaticMeta].includes(o.type))
            ?.[0];

        if (!operation) {
            this.defaultMeta();
            return;
        }

        switch (operation.type) {
            case OperatorType.StaticMeta:
                return this.renderMeta(operation);
            case OperatorType.ActiveMeta:
                return this.activeMeta(operation);
        }
    }

    private defaultMeta() {
        this.renderMeta({ title: this.defaultTitle });
    }

    private renderMeta(meta: any) {
        this.titleService.setTitle(meta.title);
    }

    private async activeMeta(meta: ReturnType<typeof activeMeta>) {
        const facade = this.registryService.getByPath<CrudCollectionState>(meta.statePath);
        const active = await facade.active$
            .pipe(
                timeout(12000),
                filter(a => !!a),
                take(1),
                catchError(e => {
                    console.error(e);
                    console.warn(`TIMEOUT ERROR: Could not find active entity in \`${meta.statePath}\` within timeout. Did you forget to use getActive in your routing instructions?`);
                    return EMPTY;
                }),
            ).toPromise();

        this.renderMeta(
            meta.factory(active),
        );
    }

}
