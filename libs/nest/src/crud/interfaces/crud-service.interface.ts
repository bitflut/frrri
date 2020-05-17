import { ParsedRequest } from '@lyxs/nest/common';
import { IdType } from '../types/id.type';
import { Defferable } from './deferrable.interface';

export interface CrudService<Entity = any, PaginatedEntity = Entity> {
    getMany?(req: ParsedRequest, ...args: any[]): Defferable<PaginatedEntity[]>;
    getOne?(req: ParsedRequest, id: IdType, ...args: any[]): Defferable<Entity>;
    deleteOne?(req: ParsedRequest, id: IdType, ...args: any[]): Defferable<void>;
    patchOne?(req: ParsedRequest, id: IdType, data: Partial<Entity>, ...args: any[]): Defferable<Entity>;
    putOne?(req: ParsedRequest, id: IdType, data: Partial<Entity>, ...args: any[]): Defferable<Entity>;
    postOne?(req: ParsedRequest, id: IdType, data: Partial<Entity>, ...args: any[]): Defferable<Entity>;
}
