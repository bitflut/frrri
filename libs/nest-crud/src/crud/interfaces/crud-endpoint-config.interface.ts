import { CrudEndpointOptions } from './crud-endpoint-options.interface';
import { EndpointDefinition } from './endpoint-definition.interface';

export type EndpointConfig = CrudEndpointOptions & EndpointDefinition;
