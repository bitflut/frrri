import { Injectable, Injector } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CrudCollectionState } from '@lyxs/angular';
import { StatesRegistryService } from '@lyxs/angular/registry';
import { EMPTY } from 'rxjs';
import { catchError, filter, take, timeout } from 'rxjs/operators';
import { META_INSTRUCTION } from '../constants';
import { activeMeta } from '../instructions/active-meta.instruction';
import { MetaInstructionType } from '../instructions/meta-instruction.enum';
import { staticMeta } from '../instructions/static-meta.instruction';

@Injectable({
    providedIn: 'root',
})
export class MetaResolver implements Resolve<any> {

    protected registryService = this.injector.get(StatesRegistryService);
    protected metaService = this.injector.get(Meta);
    protected titleService = this.injector.get(Title);

    constructor(protected injector: Injector) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const meta = route.data[META_INSTRUCTION];
        if (!meta) { return; }

        switch (meta.type) {
            case MetaInstructionType.Static:
                return this.staticMeta(meta);
            case MetaInstructionType.Active:
                return this.activeMeta(meta);
        }
    }

    private staticMeta(meta: Omit<ReturnType<typeof staticMeta>[typeof META_INSTRUCTION], 'type'>) {
        this.titleService.setTitle(meta.title);
    }

    private async activeMeta(meta: ReturnType<typeof activeMeta>[typeof META_INSTRUCTION]) {
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

        const result = meta.factory(active);
        this.staticMeta(result);
    }

}
