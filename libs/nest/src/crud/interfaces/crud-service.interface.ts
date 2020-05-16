import { CrudResponse } from './crud-response.interface';
import { Defferable } from './deferrable.interface';

interface CrudServiceTemplate<Entity = any, PaginatedEntity = Entity> {
    getMany(): Defferable<CrudResponse<PaginatedEntity[]>>;
    getOne(id: string): Defferable<CrudResponse<Entity>>;
    deleteOne(id: string): Defferable<CrudResponse<void>>;
    postOne(id: string, data: Partial<Entity>): Defferable<CrudResponse<Entity>>;
    patchOne(id: string, data: Partial<Entity>): Defferable<CrudResponse<Entity>>;
    putOne(id: string, data: Partial<Entity>): Defferable<CrudResponse<Entity>>;
}

export type CrudService<Entity = any, PaginatedEntity = Entity> = Partial<CrudServiceTemplate<Entity, PaginatedEntity>>;
