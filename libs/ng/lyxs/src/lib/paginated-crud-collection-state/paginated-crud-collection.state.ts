import { Injectable } from '@angular/core';
import { Computed, DataAction, Payload } from '@ngxs-labs/data/decorators';
import { EntityIdType } from '@ngxs-labs/data/typings/public_api';
import { Observable, pipe } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CrudCollectionReducer, CrudCollectionState, GetManyOptions, OperationContext } from '../crud-collection-state/crud-collection.state';
import { Paginated, PaginatedCrudCollectionService } from './paginated-crud-collection.service';

export type PaginatedCrudCollectionReducer<Entity = {}, IdType extends EntityIdType = EntityIdType> = CrudCollectionReducer<Entity, IdType> & {
    next: {
        size?: number;
        [key: string]: any;
    },
    nextUrl: string,
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
                this.requestOptionsPipe(OperationContext.Many),
                tap(paginated => this.setNext(paginated)),
                this.unwindPaginationPipe(),
                this.populationPipe(),
                tap(resources => this.getManySuccess(resources)),
                this.catchErrorPipe(OperationContext.Many),
            );
    }

    @DataAction()
    public getAll(@Payload('options') options: GetManyOptions = {}) {
        return this.paginatedService.getAll(this.requestOptions.collectionUrlFactory(), { ...options, size: this.pageSize })
            .pipe(
                this.requestOptionsPipe(OperationContext.Many),
                this.populationPipe(),
                tap(resources => this.getAllSuccess(resources)),
                this.catchErrorPipe(OperationContext.Many),
            );
    }

    @DataAction()
    protected getAllSuccess(@Payload('entities') entities: Entity[]) {
        this.addEntitiesMany(entities);
        this.onSuccess(OperationContext.Many);
    }

    @DataAction()
    protected setNext(@Payload('response') response: Paginated<Entity[]>) {
        if (!response.pagination?.data) {
            console.warn(
                'Pagination data not found. Did you add `PaginationInterceptor` to HTTP_INTERCEPTORS?',
            );
        }
        this.ctx.patchState({
            next: response.pagination.next,
            nextUrl: response.pagination.nextUrl,
        } as any);
    }

    @DataAction()
    public getNext() {
        const next = this.snapshot.next;
        return this.paginatedService.getNext(this.requestOptions.collectionUrlFactory(), next)
            .pipe(
                this.requestOptionsPipe<Paginated<Entity[]>>(OperationContext.Many),
                tap<Paginated<Entity[]>>(paginated => this.setNext(paginated)),
                this.unwindPaginationPipe<Paginated<Entity[]>, Entity[]>(),
                this.populationPipe<Entity[]>(),
                tap<Entity[]>(resources => this.getNextSuccess(resources)),
            );
    }

    @DataAction()
    protected getNextSuccess(@Payload('entities') entities: Entity[]) {
        this.addEntitiesMany(entities);
        this.onSuccess(OperationContext.Many);
    }

    protected unwindPaginationPipe<In, Out = In>() {
        return pipe(
            map<In | Paginated<In>, Out>(response => 'pagination' in response
                ? response.pagination.data as unknown as Out
                : response as unknown as Out,
            ),
        );
    }

}
