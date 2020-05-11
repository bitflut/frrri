import { HttpClient } from '@angular/common/http';
import { Injectable, InjectFlags, Injector } from '@angular/core';
import { GetManyOptions, OperationContext } from '@lyxs/angular/internal';
import { StatesRegistryService } from '@lyxs/angular/registry';
import { populate, PopulationOptions, PopulationStrategy } from '@lyxs/angular/routing';
import { Computed, DataAction, Payload } from '@ngxs-labs/data/decorators';
import { NgxsDataEntityCollectionsRepository } from '@ngxs-labs/data/repositories';
import { EntityIdType, NgxsEntityCollections } from '@ngxs-labs/data/typings';
import { flatten, uniq } from 'lodash';
import { EMPTY, forkJoin, Observable, of, pipe, throwError, UnaryFunction } from 'rxjs';
import { catchError, delay, map, mapTo, switchMap, tap, timeout } from 'rxjs/operators';
import { CRUD_COLLECTION_OPTIONS_TOKEN } from './constants';
import { CrudCollectionOptions } from './crud-collection.decorator';
import { CrudCollectionService } from './crud-collection.service';

export type CrudCollectionReducer<Entity = {}, IdType extends EntityIdType = EntityIdType> = NgxsEntityCollections<Entity, IdType> & {
    ids: EntityIdType[];
    entities: { [key in EntityIdType]: Entity };
    loaded: boolean;
    loading: { [key in OperationContext]: boolean | undefined };
    error: { [key in OperationContext]: string | undefined };
    active: Entity;
};

@Injectable()
export class CrudCollectionState<Entity = {}, IdType extends EntityIdType = string, Reducer extends CrudCollectionReducer<Entity, IdType> = CrudCollectionReducer<Entity, IdType>>
    extends NgxsDataEntityCollectionsRepository<Entity, IdType, Reducer> {

    private service = this.injector.get<CrudCollectionService<Entity>>(CrudCollectionService);
    private statesRegistry = this.injector.get<StatesRegistryService>(StatesRegistryService);
    private populations: Array<PopulationOptions>;
    protected http = this.injector.get(HttpClient);
    readonly requestOptions: CrudCollectionOptions['requestOptions'];
    readonly idKey: string;
    readonly baseUrl: string;
    readonly endpoint: string;
    readonly populateFactory: CrudCollectionOptions['requestOptions']['populateFactory'];

    constructor(protected injector: Injector) {
        super();

        const providerOptions = this.injector.get(CRUD_COLLECTION_OPTIONS_TOKEN, {}, InjectFlags.Optional);

        this.primaryKey = this.idKey ?? providerOptions.idKey ?? this.primaryKey; // TODO: update in @ngxs-labs/data
        this.baseUrl = providerOptions.baseUrl ?? this.baseUrl;
        this.endpoint = providerOptions.endpoint ?? this.endpoint;

        if (providerOptions.requestOptions?.populateFactory) {
            this.populateFactory = providerOptions.requestOptions.populateFactory;
        }

        this.requestOptions = {
            collectionUrlFactory: () => `${this.baseUrl}/${this.endpoint}`,
            resourceUrlFactory: id => `${this.baseUrl}/${this.endpoint}/${id}`,
            ...providerOptions.requestOptions,
            ...this.requestOptions,
        };
    }

    public resetPopulations(): void {
        this.populations = undefined;
    }

    public setPopulations(data: Array<ReturnType<typeof populate>>) {
        this.populations = uniq([
            ...this.populations ?? [],
            ...data,
        ]);
    }

    @Computed()
    public get loading$() {
        return this.state$.pipe(map((value: Reducer) => value.loading));
    }

    @Computed()
    public get loadingAny$() {
        return this.state$.pipe(map((value: Reducer) => !!value.loading));
    }

    @Computed()
    public get loadingMany$() {
        return this.state$.pipe(map((value: Reducer) => value.loading[OperationContext.Many]));
    }

    @Computed()
    public get loadingOne$() {
        return this.state$.pipe(map((value: Reducer) => value.loading[OperationContext.One]));
    }

    @Computed()
    public get loaded$() {
        return this.state$.pipe(map((value: Reducer) => value.loaded));
    }

    @Computed()
    public get loadingFirst$() {
        return this.state$.pipe(map((value: Reducer) => !value.loaded && value.loading[OperationContext.Many]));
    }

    @Computed()
    public get loadingNext$() {
        return this.state$.pipe(map((value: Reducer) => value.loaded && value.loading[OperationContext.Many]));
    }

    @Computed()
    public get empty$() {
        return this.state$.pipe(map((value: Reducer) => value.loaded && !value.ids.length));
    }

    @Computed()
    public get errors$() {
        return this.state$.pipe(map((value: Reducer) => Object.values(value?.error || {})));
    }

    @Computed()
    public get errorMany$() {
        return this.state$.pipe(map((value: Reducer) => value.error[OperationContext.Many]));
    }

    @Computed()
    public get errorOne$() {
        return this.state$.pipe(map((value: Reducer) => value.error[OperationContext.One]));
    }

    @Computed()
    public get all$(): Observable<Entity[]> {
        return this.state$.pipe(map((value: Reducer) => Object.values(value.entities)));
    }

    @Computed()
    public get one$() {
        return (id: IdType) => this.state$.pipe(map((value: Reducer) => {
            console.log(id, id && value.entities[id.toString()]);
            return id && value.entities[id.toString()];
        }));
    }

    @Computed()
    public get activeId$(): Observable<IdType> {
        return this.state$.pipe(map((value: Reducer) => value.active && value.active[this.primaryKey]));
    }

    @Computed()
    public get active$(): Observable<Entity> {
        return this.state$.pipe(map((value: Reducer) => value.active));
    }

    @DataAction()
    public setLoading(
        @Payload('context') context: OperationContext,
        @Payload('loading') loading: boolean | undefined,
    ): void {
        const state = this.getState();
        this.ctx.patchState({
            loading: {
                ...state.loading,
                [context]: loading,
            },
            error: {
                ...state.error,
                [context]: loading ? undefined : state.error[context],
            },
        } as any);
    }

    @DataAction()
    public setLoaded(@Payload('loaded') loaded: boolean): void {
        this.ctx.patchState({ loaded } as any);
    }

    @DataAction()
    public setError(
        @Payload('context') context: OperationContext,
        @Payload('error') error: string,
    ): void {
        this.ctx.patchState({
            error: {
                ...this.ctx.getState().error,
                [context]: error,
            },
        } as any);
    }

    @DataAction()
    public setActive(@Payload('entity') entity?: Entity): void {
        this.ctx.patchState({ active: entity } as any);
    }

    @DataAction()
    public deactivate(): void {
        this.ctx.patchState({ active: undefined } as any);
    }

    @DataAction()
    public getActive(@Payload('id') id: IdType) {
        this.ctx.patchState({ active: { [this.primaryKey]: id } } as any);
        return this.service.getOne(this.requestOptions.resourceUrlFactory(id))
            .pipe(
                this.requestOptionsPipe(OperationContext.One),
                this.populationPipe(),
                tap(resource => this.getActiveSuccess(resource)),
                this.catchErrorPipe(OperationContext.One),
            );
    }

    @DataAction()
    protected getActiveSuccess(@Payload('response') entity: Entity) {
        this.ctx.patchState({ active: entity } as any);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public getMany(@Payload('options') options: GetManyOptions = {}) {
        return this.service.getMany(this.requestOptions.collectionUrlFactory(), options)
            .pipe(
                this.requestOptionsPipe(OperationContext.Many),
                this.populationPipe(),
                tap(resources => this.getManySuccess(resources)),
                this.catchErrorPipe(OperationContext.Many),
            );
    }

    /** Used in RouteResolver's population for potentially paginated collections */
    public getAll(options: GetManyOptions = {}) {
        return this.getMany(options);
    }

    @DataAction()
    protected getManySuccess(@Payload('response') entities: any) {
        this.addEntitiesMany(entities);
        this.onSuccess(OperationContext.Many);
    }

    @DataAction()
    public getOne(@Payload('id') id: IdType) {
        return this.service.getOne(this.requestOptions.resourceUrlFactory(id))
            .pipe(
                this.requestOptionsPipe(OperationContext.One),
                this.populationPipe(),
                tap(resource => this.getOneSuccess(resource)),
                this.catchErrorPipe(OperationContext.One),
            );
    }

    @DataAction()
    protected getOneSuccess(@Payload('response') entity: Entity) {
        this.addEntityOne(entity);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public patchOne(@Payload('update') update: { id: IdType, changes: Partial<Entity> }) {
        return this.service.patchOne(this.requestOptions.resourceUrlFactory(update.id), update.changes)
            .pipe(
                this.requestOptionsPipe(OperationContext.One),
                this.populationPipe(),
                tap(resource => this.patchOneSuccess({ id: update.id, changes: resource })),
                this.catchErrorPipe(OperationContext.One),
            );
    }

    @DataAction()
    protected patchOneSuccess(@Payload('response') update: { id: IdType, changes: Entity }) {
        this.updateEntitiesMany([update]);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public patchOneOptimistic(@Payload('update') update: { id: IdType, changes: Partial<Entity> }) {
        const original = this.snapshot.entities[update.id];
        this.updateOne({ id: update.id, changes: update.changes });
        return this.service.patchOne(this.requestOptions.resourceUrlFactory(update.id), update.changes)
            .pipe(
                this.catchOptimistcUndoPipe(() => this.patchOneOptimisticUndo({ id: update.id, changes: original })),
                this.requestOptionsPipe(OperationContext.One),
                this.populationPipe(),
                this.catchErrorPipe(OperationContext.One),
            );
    }

    @DataAction()
    protected patchOneOptimisticUndo(@Payload('undo') undoUpdate: { id: IdType, changes: Entity }) {
        this.updateEntitiesMany([undoUpdate]);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public putOne(@Payload('update') update: { id: IdType, changes: Partial<Entity> }) {
        return this.service.putOne(this.requestOptions.resourceUrlFactory(update.id), update.changes)
            .pipe(
                this.requestOptionsPipe(OperationContext.One),
                this.populationPipe(),
                tap(resource => this.putOneSuccess({ id: update.id, changes: resource })),
                this.catchErrorPipe(OperationContext.One),
            );
    }

    @DataAction()
    protected putOneSuccess(@Payload('response') update: { id: IdType, changes: Entity }) {
        this.updateEntitiesMany([update]);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public postOne(@Payload('entity') entity: Partial<Entity>) {
        return this.service.postOne(this.requestOptions.collectionUrlFactory(), entity)
            .pipe(
                this.requestOptionsPipe(OperationContext.One),
                this.populationPipe(),
                tap(resource => this.addEntityOne(resource)),
                this.catchErrorPipe(OperationContext.One),
            );
    }

    @DataAction()
    protected postOneSuccess(@Payload('response') entity: Entity) {
        this.addEntityOne(entity);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public postOneOptimistic(@Payload('entity') entity: Entity) {
        if (!entity[this.primaryKey]) {
            throw new Error('Entity id is required for optimistic actions');
        }
        this.addEntityOne(entity);
        return this.service.postOne(this.requestOptions.collectionUrlFactory(), entity)
            .pipe(
                this.requestOptionsPipe(OperationContext.One),
                this.populationPipe(),
                this.catchOptimistcUndoPipe(() => this.postOneOptimisticUndo(entity[this.primaryKey])),
                this.catchErrorPipe(OperationContext.One),
            );
    }

    @DataAction()
    protected postOneOptimisticUndo(@Payload('undo') id: IdType) {
        this.removeEntitiesMany([id]);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public deleteOne(@Payload('id') id: IdType) {
        return this.service.deleteOne(this.requestOptions.resourceUrlFactory(id))
            .pipe(
                this.requestOptionsPipe(OperationContext.One),
                // this.populationPipe(),
                tap(() => this.deleteOneSuccess(id)),
                this.catchErrorPipe(OperationContext.One),
            );
    }

    @DataAction()
    protected deleteOneSuccess(@Payload('response') id: IdType) {
        this.removeEntitiesMany([id]);
        this.onSuccess(OperationContext.One);
    }

    @DataAction()
    public deleteOneOptimistic(@Payload('id') id: IdType) {
        const original = this.snapshot.entities[id];
        this.removeEntitiesMany([id]);
        return this.service.deleteOne(this.requestOptions.resourceUrlFactory(id))
            .pipe(
                this.catchOptimistcUndoPipe(() => this.deleteOneOptimisticUndo(original)),
                this.requestOptionsPipe(OperationContext.One),
                // this.populationPipe(),
                this.catchErrorPipe(OperationContext.One),
            );
    }

    @DataAction()
    protected deleteOneOptimisticUndo(@Payload('undo') entity: Entity) {
        this.addEntityOne(entity);
        this.onSuccess(OperationContext.One);
    }

    protected onSuccess(context: OperationContext) {
        this.ctx.patchState({
            loading: {
                ...this.ctx.getState().loading,
                [context]: undefined,
            },
            error: {
                ...this.ctx.getState().error,
                [context]: undefined,
            },
            loaded: true,
        } as any);
    }

    protected catchOptimistcUndoPipe<In, Out = In>(undoFn: () => void) {
        return pipe(
            catchError((error) => {
                undoFn();
                return throwError(error);
            }),
        ) as UnaryFunction<Observable<In>, Observable<Out>>;
    }

    protected requestOptionsPipe<In, Out = In>(context: OperationContext) {
        this.ctx.patchState({
            loading: {
                ...this.ctx.getState().loading,
                [context]: true,
            },
            error: {
                ...this.ctx.getState().error,
                [context]: undefined,
            },
        } as any);

        return pipe(
            timeout(this.requestOptions?.timeout || 30000),
            this.requestOptions?.delay
                ? delay(this.requestOptions.delay)
                : tap(),
        ) as UnaryFunction<Observable<In>, Observable<Out>>;
    }

    private populate<In extends Array<any>>(entities: In, population: PopulationOptions) {
        const facade = this.statesRegistry.getByPath(population.statePath);
        let ownIdKey: string;
        let foreignIdKey: string;

        switch (population.strategy) {
            case PopulationStrategy.Id:
                ownIdKey = population.idPath;
                foreignIdKey = facade.primaryKey;
                break;

            case PopulationStrategy.ForeignId:
                ownIdKey = facade.primaryKey;
                foreignIdKey = population.idPath;
                break;
        }

        const entityIds: IdType[] = flatten(
            entities.map(entity => entity[ownIdKey]),
        );

        // Look if we already have these entities in our cache
        if (population.strategy === PopulationStrategy.Id) {
            const entityIdsFiltered: IdType[] = entityIds.filter(id => !facade.ids.includes(id as any));
            if (!entityIdsFiltered.length) { return of([]); }
        }

        const defaultFactory = (ids: IdType[], path: string) => ({ [path]: uniq(ids.map(id => id.toString())) });
        const factory = population.populatFactory || this.populateFactory || defaultFactory;
        return facade.getAll({
            params: {
                ...population.params,
                ...factory(entityIds, foreignIdKey),
            },
        });
    }

    protected populationPipe<In>(): UnaryFunction<Observable<In>, Observable<In>> {
        return pipe(
            switchMap(result => {
                const hasPopulations = !!this.populations?.length;
                if (!hasPopulations) { return of(result); }

                const operation = Array.isArray(result) ? OperationContext.Many : OperationContext.One;
                const populations = this.populations.filter(p => p.operations.includes(operation));
                if (!populations.length) { return of(result); }

                const entities: In[] = Array.isArray(result) ? result : [result];
                return forkJoin(
                    this.populations
                        .filter(p => p.operations.includes(operation))
                        .map(p => this.populate(entities, p)),
                ).pipe(mapTo(result));
            }),
        );
    }

    protected catchErrorPipe<In, Out = In>(context: OperationContext) {
        return pipe(
            catchError(error => {
                this.ctx.patchState({
                    loading: {
                        ...this.ctx.getState().loading,
                        [context]: undefined,
                    },
                } as any);
                this.setError(context, error?.message || JSON.stringify(error));
                return EMPTY;
            }),
        ) as UnaryFunction<Observable<In>, Observable<Out>>;
    }
}
