import { OperationContext, RouteInstructionType } from '@lyxs/angular/internal';
import { EntityIdType } from '@ngxs-labs/data/typings/public_api';
import { PopulationStrategy } from './population-strategy.enum';

export interface PopulateInstruction<IdType = EntityIdType> {
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

export function populate<IdType = EntityIdType>(options: PopulateInstruction<IdType>) {
    return {
        type: RouteInstructionType.Populate as RouteInstructionType.Populate,
        strategy: options.strategy ?? PopulationStrategy.Id,
        params: {},
        ...options,
    };
}
