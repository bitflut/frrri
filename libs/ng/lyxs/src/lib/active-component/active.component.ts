import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { PaginatedCrudCollectionState } from '../paginated-crud-collection-state/paginated-crud-collection.state';
import { StatesRegistryService } from '../states-registry/states-registry.service';

@Component({
    selector: 'lyxs-active',
    templateUrl: './active.component.html',
    styleUrls: ['./active.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveComponent implements OnInit, OnDestroy {

    @Input() path: string;
    protected facade: PaginatedCrudCollectionState;

    active$: Observable<any>;
    loading$: Observable<boolean>;
    error$: Observable<string>;

    constructor(
        private statesRegistryService: StatesRegistryService<PaginatedCrudCollectionState>,
    ) { }

    ngOnInit(): void {
        if (!this.path) {
            throw new Error('Missing input `path` (<lya-active path="cache.posts">)');
        }

        try {
            this.facade = this.statesRegistryService.getByPath(this.path);
            if (!this.facade) { throw new Error(); }
        } catch (e) {
            throw new Error(`<lya-active> could not find path \`${this.path}\` in registered states`);
        }

        this.active$ = this.facade.active$.pipe(untilDestroyed(this));
        this.loading$ = this.facade.loadingOne$.pipe(untilDestroyed(this));
        this.error$ = this.facade.errorOne$.pipe(untilDestroyed(this));
    }

    loadNext() {
        this.facade.getNext().toPromise();
    }

    ngOnDestroy() { }

}
