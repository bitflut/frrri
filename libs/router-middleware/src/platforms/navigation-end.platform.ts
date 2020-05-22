import { Injectable, Injector } from '@angular/core';
import { ActivationEnd, NavigationStart, Resolve, Router } from '@angular/router';
import { concatMapTo, filter, map, take } from 'rxjs/operators';
import { Platform } from '../enums/platform.enum';
import { PlatformFactory } from '../factories/platform.factory';

@Injectable()
export class NavigationEndPlatform<T = any> extends PlatformFactory(Platform.NavigationEnd) implements Resolve<T> {

    constructor(protected injector: Injector) {
        super(injector);
        const router = this.injector.get(Router);
        router.events.pipe(
            filter(startEvent => startEvent instanceof NavigationStart),
            concatMapTo(
                router.events.pipe(
                    filter(event => event instanceof ActivationEnd),
                    take(1),
                    map((event: ActivationEnd) => event.snapshot),
                ),
            ),
        )
            .subscribe(
                event => this['resolve']?.(event, router.routerState.snapshot),
            );
    }

}
