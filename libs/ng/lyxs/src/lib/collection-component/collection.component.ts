import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EntityIdType } from '@ngxs-labs/data/typings';
import { Observable, pipe, Subject, UnaryFunction } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PaginatedCrudCollectionState } from '../paginated-crud-collection-state/paginated-crud-collection.state';
import { StatesRegistryService } from '../states-registry/states-registry.service';

@Component({
    selector: 'lyxs-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent implements OnInit, OnDestroy {

    private unsubscribe$ = new Subject<boolean>();

    @Input() path: string;
    protected facade: PaginatedCrudCollectionState;

    all$: Observable<any[]>;
    loading$: Observable<boolean>;
    loadingFirst$: Observable<boolean>;
    loadingNext$: Observable<boolean>;
    error$: Observable<string | undefined>;
    empty$: Observable<boolean>;
    next$?: Observable<any | false>;
    activeId$?: Observable<EntityIdType | undefined>;

    constructor(
        private statesRegistryService: StatesRegistryService<PaginatedCrudCollectionState>,
    ) { }

    ngOnInit(): void {
        if (!this.path) {
            throw new Error('Missing input `path` (<lya-collection path="cache.posts">)');
        }

        try {
            this.facade = this.statesRegistryService.getByPath(this.path);
            if (!this.facade) { throw new Error(); }
        } catch (e) {
            throw new Error(`<lya-collection> could not find path \`${this.path}\` in registered states`);
        }

        this.all$ = this.facade.all$.pipe(this.untilDestroyed());
        this.loading$ = this.facade.loadingMany$.pipe(this.untilDestroyed());
        this.loadingFirst$ = this.facade.loadingFirst$.pipe(this.untilDestroyed());
        this.loadingNext$ = this.facade.loadingNext$.pipe(this.untilDestroyed());
        this.error$ = this.facade.errorMany$.pipe(this.untilDestroyed());
        this.empty$ = this.facade.empty$.pipe(this.untilDestroyed());
        this.next$ = this.facade.next$.pipe(this.untilDestroyed());
        this.activeId$ = this.facade.activeId$.pipe(this.untilDestroyed());
    }

    loadNext() {
        this.facade.getNext().toPromise();
    }

    activate(id: any) {
        if (typeof id === 'undefined') {
            throw new Error('Provide \`id\` for activate(id)');
        }
        this.facade.getActive(id).toPromise();
    }

    trackByKey(key: string) {
        return (index: number, item: any) => {
            return item[key] ?? index;
        };
    }

    private untilDestroyed<In>() {
        return pipe(
            takeUntil(this.unsubscribe$),
        ) as UnaryFunction<Observable<In>, Observable<In>>;
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

}
