import { Injectable } from '@angular/core';
import { ActivationEnd, NavigationStart, Router } from '@angular/router';
import { concatMapTo, filter, take } from 'rxjs/operators';
import { MetaService } from './meta.service';

@Injectable({
    providedIn: 'root',
})
export class MetaNavigationService {

    constructor(
        private router: Router,
        private metaService: MetaService,
    ) {
        this.router.events.pipe(
            filter(startEvent => startEvent instanceof NavigationStart),
            concatMapTo(this.router.events
                .pipe(
                    filter(event => event instanceof ActivationEnd),
                    take(1),
                ),
            ),
        )
            .subscribe(event => this.metaService.update(event['snapshot'].data));
    }

}
