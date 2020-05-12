import { OperationContext } from '@lyxs/angular/internal';
import { EntityIdType } from '@ngxs-labs/data/typings';
import { CRUD_ROUTE_DATA } from './constants';

export enum RouteInstructionType {
    /** Uses getMany */
    GetMany = 'getMany',
    /** Uses getOne */
    GetOne = 'getOne',
    /** Uses getActive */
    GetActive = 'getActive',
    /** Uses deactivate */
    Deactivate = 'deactivate',
    /** Sets populate instruction */
    Populate = 'populate',
    /** Resets this state and all its children */
    Reset = 'reset',
}

interface RouteOptions {
    /** Await until loaded (default: `false`) */
    await?: boolean;
    /**
     * During server side rendering, you probably want to wait for your resource to load
     * before resolving, regardless of the browser behaviour specified by `await`.
     */
    awaitPlatformServer?: boolean;
}

const routeOptionsDefaults = {
    await: false,
    awaitPlatformServer: true,
} as RouteOptions;

interface ResourceRouteOptions extends RouteOptions {
    /** Key in route.params containing the id to resolve (default: `'id'`) */
    param?: string;
}

const resourseRouteOptionsDefaults = {
    ...routeOptionsDefaults,
    param: 'id',
} as ResourceRouteOptions;

export function getOne(
    options: ResourceRouteOptions = resourseRouteOptionsDefaults,
) {
    options = {
        ...resourseRouteOptionsDefaults,
        ...options,
    };

    return {
        type: RouteInstructionType.GetOne as RouteInstructionType.GetOne,
        ...options,
    };
}

export function getActive(
    options: ResourceRouteOptions = {},
) {
    options = {
        ...resourseRouteOptionsDefaults,
        ...options,
    };

    return {
        type: RouteInstructionType.GetActive as RouteInstructionType.GetActive,
        ...options,
    };
}

interface CollectionRouteOptions extends RouteOptions {
    params?: { [key: string]: string | string[] };
}

export function getMany(
    /** Params passed to getMany request */
    options: CollectionRouteOptions = {},
) {
    options = {
        ...routeOptionsDefaults,
        params: {},
        ...options,
    };

    return {
        type: RouteInstructionType.GetMany as RouteInstructionType.GetMany,
        ...options,
    };
}

export interface PopulateRouteData<IdType = EntityIdType> {
    /** Path to `id` in entity */
    idPath: string;
    /** StatePath that will be populated */
    statePath: string;
    /** Strategy used when mapping ids (default: `PopulationStrategy.Id`) */
    strategy?: PopulationStrategy;
    operations?: Array<OperationContext>;
    /** Params to add to getMany request */
    params?: { [key: string]: string };
    /**
     * Used to map ids to getMany params when populating.
     * Default:
     * ```
     * (ids: IdType[], path: string) => {
     *     return {
     *          [`filter[${path}][$in]`]: uniq(ids),
     *     }
     * }
     * ```
     */
    populatFactory?: (ids: IdType[], path: string) => any;
}

export enum PopulationStrategy {
    /** Own id found on foreign entity (`ForeignEntity[idPath] = ThisEntity.id`) */
    ForeignId = 'foreignId',
    /** Foreign id(s) found on this entity (`ForeignEntity[id] = ThisEntity[idPath]`) */
    Id = 'id',
}

/** Populates every request */
export function populate<IdType = EntityIdType>(options: PopulateRouteData<IdType>) {
    return {
        type: RouteInstructionType.Populate as RouteInstructionType.Populate,
        strategy: options.strategy ?? PopulationStrategy.Id,
        params: {},
        ...options,
    };
}

export function deactivate() {
    return {
        type: RouteInstructionType.Deactivate as RouteInstructionType.Deactivate,
    };
}

export function reset() {
    return {
        type: RouteInstructionType.Reset as RouteInstructionType.Reset,
    };
}

export type PopulationOptions = ReturnType<typeof populate>;
export type RouteData =
    ReturnType<typeof getActive>
    | ReturnType<typeof getMany>
    | ReturnType<typeof getOne>
    | ReturnType<typeof reset>
    | ReturnType<typeof deactivate>
    | PopulationOptions;

export function instructions(data: { [key: string]: RouteData | Array<RouteData> }) {
    return {
        [CRUD_ROUTE_DATA]: data,
    };
}

