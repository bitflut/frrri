import { ParsedRequest } from '@lyxs/nest-crud';
import { FilterQuery } from 'mongoose';

interface RequestQuery {
    conditions: FilterQuery<any>;
    select: string;
    sort: string;
}

export interface ParsedMongooseRequest extends ParsedRequest<RequestQuery> {
}
