import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { RouteInstruction } from '@lyxs/angular/routing';
import { extractMeta } from './helper';

@Injectable({
    providedIn: 'root',
})
export class MetaResolver {

    async resolveWithData<T = any>(data: T, instructions: RouteInstruction[], route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const meta = extractMeta(instructions);
        console.log('meta', meta);
        return;
    }

}
