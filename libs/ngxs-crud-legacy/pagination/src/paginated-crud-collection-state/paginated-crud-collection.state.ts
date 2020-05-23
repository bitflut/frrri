import { Injectable } from '@angular/core';
import { CrudCollectionReducer, CrudCollectionState } from '@frrri/ngxs-crud';
import { GetManyOptions, OperationContext } from '@frrri/ngxs-crud-legacy/internal';
import { Computed, DataAction, Payload } from '@ngxs-labs/data/decorators';
import { EntityIdType } from '@ngxs-labs/data/typings';
import { Observable, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Paginated, PaginatedCrudCollectionService } from './paginated-crud-collection.service';

export type PaginatedCrudCollectionReducer<Entity = {}, IdType extends EntityIdType = EntityIdType> = CrudCollectionReducer<Entity, IdType> & {
    next: string,
};

@Injectable()
export class PaginatedCrudCollectionState<Entity = {}, IdType extends EntityIdType = string, Reducer extends PaginatedCrudCollectionReducer<Entity, IdType> = PaginatedCrudCollectionReducer<Entity, IdType>>
    extends CrudCollectionState<Entity, IdType, Reducer> {

    protected readonly pageSize: number;
    private paginatedService = this.injector.get<PaginatedCrudCollectionService<Entity>>(PaginatedCrudCollectionService);

    @Computed()
    public get next$(): Observable<any> {
        return this.state$.pipe(map((value: Reducer) => value.next));
    }

    @DataAction()
    public getMany(@Payload('options') options: GetManyOptions = {}) {
        return this.paginatedService.getMany(this.requestOptions.collectionUrlFactory(), { ...options, size: this.pageSize })
            .pipe(
                this.requestPipe<Paginated<Entity[]>, Entity[]>({
                    context: OperationContext.Many,
                    success: resources => this.getManySuccess(resources),
                    prepend: () => this.paginationPipe(),
                }),
            );
    }

    @DataAction()
    public getAll(@Payload('options') options: GetManyOptions = {}) {
        this.ctx.patchState({ loaded: false } as any);
        return this.paginatedService.getAll(this.requestOptions.collectionUrlFactory(), { ...options, size: this.pageSize })
            .pipe(
                this.requestPipe({
                    context: OperationContext.Many,
                    success: resources => this.getAllSuccess(resources),
                }),
            );
    }

    @DataAction()
    protected getAllSuccess(@Payload('entities') entities: Entity[]) {
        this.addEntitiesMany(entities);
        this.onSuccess(OperationContext.Many);
    }

    @DataAction()
    protected setNext(@Payload('response') response: Paginated) {
        if (!response.pagination?.data) {
            console.warn(
                'Pagination data not found. Did you add `PaginationInterceptor` to HTTP_INTERCEPTORS?',
            );
        }
        this.ctx.patchState({
            next: response.pagination.next,
        } as any);
    }

    @DataAction()
    public getNext() {
        const url = this.snapshot.next;
        return this.paginatedService.getNext(url)
            .pipe(
                this.requestPipe<Paginated<Entity[]>, Entity[]>({
                    context: OperationContext.Many,
                    success: resources => this.getNextSuccess(resources),
                    prepend: () => this.paginationPipe(),
                }),
            );
    }

    @DataAction()
    protected getNextSuccess(@Payload('entities') entities: Entity[]) {
        this.addEntitiesMany(entities);
        this.onSuccess(OperationContext.Many);
    }

    protected paginationPipe<In, Out = In>() {
        return pipe(
            tap<In | Paginated<In>>(response => {
                if ('pagination' in response) {
                    this.setNext(response);
                }
            }),
            map<In | Paginated<In>, Out>(response => 'pagination' in response
                ? response.pagination.data as unknown as Out
                : response as unknown as Out,
            ),
        );
    }

}
