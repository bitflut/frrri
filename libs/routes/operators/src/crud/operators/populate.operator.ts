import { Platform } from '@frrri/routes';
import { Operation } from '../../interfaces/operation.interface';
import { CrudOperatorType } from '../enums/crud-operator-type';

export function populate(
    options: {
        /** State path that triggers a population */
        from: string,
        /** State path getting populated */
        to: string,
        /** Path of id property */
        idPath?: string,
        /** State path of collection containing id (foreign vs self) */
        idSource?: string,
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
        populatFactory?: (ids: string | number[], path: string) => any;
    },
) {
    return {
        type: CrudOperatorType.Populate as CrudOperatorType.Populate,
        statePath: options.from,
        toStatePath: options.to,
        idPath: options.idPath ?? 'id',
        idSource: options.idSource ?? options.from,
        platforms: [Platform.Resolver],
        ...options,
    } as Operation;
}
