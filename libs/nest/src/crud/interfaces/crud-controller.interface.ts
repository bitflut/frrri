import { CrudResponse } from './crud-response.interface';
import { CrudService } from './crud-service.interface';
import { Defferable } from './deferrable.interface';

interface CrudControllerEndpoints<Entity = any, PaginatedEntity = Entity> {
    getMany(): Defferable<CrudResponse<PaginatedEntity[]>>;
    getOne(): Defferable<CrudResponse<Entity>>;
    deleteOne(): Defferable<CrudResponse<void>>;
    patchOne(): Defferable<CrudResponse<Entity>>;
    postOne(): Defferable<CrudResponse<Entity>>;
    putOne(): Defferable<CrudResponse<Entity>>;
}

export type CrudController<Entity = any, PaginatedEntity = Entity> =
    Partial<CrudControllerEndpoints<Entity, PaginatedEntity>>
    & { service: CrudService<Entity, PaginatedEntity> };
