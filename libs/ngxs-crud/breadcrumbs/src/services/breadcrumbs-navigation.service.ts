import { Injectable } from '@angular/core';
import { ActivationEnd, NavigationStart, Router } from '@angular/router';
import { concatMapTo, filter, take } from 'rxjs/operators';
import { BreadcrumbsService } from './breadcrumbs.service';

@Injectable()
export class BreadcrumbsNavigationService {

    constructor(
        private router: Router,
        private breadcrumbsService: BreadcrumbsService,
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
            .subscribe(event => this.breadcrumbsService.update(event['snapshot']));
    }

}
