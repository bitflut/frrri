import { Injectable, Injector } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteInstruction } from '@lyxs/angular/routing';
import { extractMeta } from './helper';

@Injectable({
    providedIn: 'root',
})
export class MetaResolver {

    protected metaService = this.injector.get(Meta);
    protected titleService = this.injector.get(Title);

    constructor(protected injector: Injector) { }

    async resolveWithData<T = any>(data: T, instructions: RouteInstruction[], route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const meta = extractMeta(instructions);
        // if (!meta) { return; }
        // console.log('meta', meta, data);
        // this.titleService.setTitle((data as any).title);
        return;
    }

}
