import { Injectable, Injector } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { forkJoin, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { FRRRI_MIDDLEWARE, FRRRI_OPERATIONS } from '../constants';
import { Platform } from '../enums/platform.enum';
import { toObservable } from '../helpers/is-observable';

export function PlatformFactory(platform: Platform) {
    @Injectable()
    abstract class PlatformAbstract<T = any> implements Resolve<T> {

        constructor(protected injector: Injector) { }

        getOperations(route: ActivatedRouteSnapshot) {
            return route.data[FRRRI_OPERATIONS]
                ?.filter(operation => operation.platforms.includes(platform));
        }

        getMiddlewares() {
            return this.injector.get(FRRRI_MIDDLEWARE)
                ?.filter(middleware => middleware.platforms.includes(platform));
        }

        getOperations$(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            const operations = this.getOperations(route) ?? [];
            console.log('there', operations)
            // if (!operations.length) { return; }

            console.log('here')
            const operations$: Observable<any>[] = [];
            operations.forEach(operation =>
                this.getMiddlewares()
                    .forEach(resolver => {
                        const resolved = resolver.operate(operation, route, state);
                        operations$.push(
                            toObservable(resolved).pipe(map(result => ({ operation, result }))),
                        );
                    }),
            );

            return operations$;
        }

        resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            return forkJoin(this.getOperations$(route, state)).pipe(tap(console.log));
        }

    }

    return PlatformAbstract;
}
