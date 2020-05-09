import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EntityIdType } from '@ngxs-labs/data/typings/public_api';
import { Observable, pipe, Subject, UnaryFunction } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaginatedCrudCollectionState } from '../../paginated-crud-collection-state/paginated-crud-collection.state';
import { StatesRegistryService } from '../../states-registry/states-registry.service';

@Component({
    selector: 'lyxs-active',
    templateUrl: './active.component.html',
    styleUrls: ['./active.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActiveComponent implements OnInit, OnDestroy {

    private destroy$ = new Subject<void>();

    @Input() path: string;
    protected facade: PaginatedCrudCollectionState;

    active$: Observable<any>;
    activeId$: Observable<EntityIdType>;
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

        this.active$ = this.facade.active$.pipe(this.untilDestroyed());
        this.activeId$ = this.facade.activeId$.pipe(this.untilDestroyed());
        this.loading$ = this.facade.loadingOne$.pipe(this.untilDestroyed());
        this.error$ = this.facade.errorOne$.pipe(this.untilDestroyed());
    }

    private untilDestroyed<In>() {
        return pipe(
            takeUntil(this.destroy$),
        ) as UnaryFunction<Observable<In>, Observable<In>>;
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

}
