import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { MetaService } from './meta.service';

@Injectable({
    providedIn: 'root',
})
export class MetaResolver implements Resolve<any> {

    protected metaService = this.injector.get(MetaService);

    constructor(protected injector: Injector) { }

    async resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.metaService.update(route.data);
    }

}
