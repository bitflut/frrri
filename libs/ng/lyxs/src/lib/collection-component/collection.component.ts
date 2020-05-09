import { ChangeDetectionStrategy, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { EntityIdType } from '@ngxs-labs/data/typings/public_api';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Observable } from 'rxjs';
import { PaginatedCrudCollectionState } from '../paginated-crud-collection-state/paginated-crud-collection.state';
import { StatesRegistryService } from '../states-registry/states-registry.service';

@Component({
    selector: 'lyxs-collection',
    templateUrl: './collection.component.html',
    styleUrls: ['./collection.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollectionComponent implements OnInit, OnDestroy {

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

        this.all$ = this.facade.all$.pipe(untilDestroyed(this));
        this.loading$ = this.facade.loadingMany$.pipe(untilDestroyed(this));
        this.loadingFirst$ = this.facade.loadingFirst$.pipe(untilDestroyed(this));
        this.loadingNext$ = this.facade.loadingNext$.pipe(untilDestroyed(this));
        this.error$ = this.facade.errorMany$.pipe(untilDestroyed(this));
        this.empty$ = this.facade.empty$.pipe(untilDestroyed(this));
        this.next$ = this.facade.next$.pipe(untilDestroyed(this));
        this.activeId$ = this.facade.activeId$.pipe(untilDestroyed(this));
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

    ngOnDestroy() { }

}
