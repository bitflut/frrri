import { EntityIdType } from '@ngxs-labs/data/typings/public_api';
import { uniq } from 'lodash';
import { CRUD_ROUTE_DATA } from './constants';

export enum RouteInstructionType {
    /** Uses getMany */
    GetMany = 'getMany',
    /** Uses getOne */
    GetOne = 'getOne',
    /** Uses getActive */
    GetActive = 'getActive',
    /** Sets populate instruction */
    Populate = 'populate',
}

interface RouteOptions {
    /** Await until loaded (default: `true`) */
    await?: boolean;
}

const routeOptionsDefaults = {
    await: true,
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
    params?: { [key: string]: string };
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
        populatFactory: (ids: IdType[], path: string) => ({ [`filter[${path}][$in]`]: uniq(ids.map(id => id.toString())) }),
        ...options,
    };
}

export type PopulationOptions = ReturnType<typeof populate>;
export type RouteData = ReturnType<typeof getActive> | ReturnType<typeof getMany> | ReturnType<typeof getOne> | PopulationOptions;

export function crudRouteInstructions(data: { [key: string]: RouteData | Array<RouteData> }) {
    return {
        [CRUD_ROUTE_DATA]: data,
    };
}

