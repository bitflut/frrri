import { ParsedRequest } from '@lyxs/nest/common';
import { IdType } from '../types/id.type';
import { CrudService } from './crud-service.interface';
import { Defferable } from './deferrable.interface';

export interface CrudController<Entity = any, PaginatedEntity = Entity> {
    service: CrudService<Entity, PaginatedEntity>;
    getMany?(req: ParsedRequest, ...args: any[]): Defferable<PaginatedEntity[]>;
    getOne?(req: ParsedRequest, id: IdType, ...args: any[]): Defferable<Entity>;
    deleteOne?(req: ParsedRequest, id: IdType, ...args: any[]): Defferable<void>;
    patchOne?(req: ParsedRequest, id: IdType, data: Partial<Entity>, ...args: any[]): Defferable<Entity>;
    putOne?(req: ParsedRequest, id: IdType, data: Partial<Entity>, ...args: any[]): Defferable<Entity>;
    postOne?(req: ParsedRequest, id: IdType, data: Partial<Entity>, ...args: any[]): Defferable<Entity>;
}

