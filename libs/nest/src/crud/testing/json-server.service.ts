import { HttpService, Injectable } from '@nestjs/common';
import { Observable, pipe, UnaryFunction } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';
import { ClassType } from '../interfaces/class.interface';
import { CrudResponse } from '../interfaces/crud-response.interface';

export function JsonServerOptions(options: {
    collection: string;
    apiUrl?: string;
    validate?: boolean;
}) {
    options = {
        apiUrl: 'http://localhost:3000',
        validate: true,
        ...options,
    };

    return function (target: ClassType) {
        if (options.validate) {
            const isServiceInherited = target.prototype instanceof JsonServerService;
            if (!isServiceInherited) {
                throw new Error(`\`${target.name}\` does not extend \`JsonServerService\``);
            }
        }
        target.prototype.collection = options.collection;
        target.prototype.apiUrl = options.apiUrl;
    };
}

@Injectable()
export class JsonServerService<Entity = any, PaginatedEntity = Entity> {

    collection: string;
    apiUrl: string;
    responseHeaders: any;

    constructor(
        private http: HttpService,
    ) { }

    private composeUrl(...parts: string[]) {
        return [this.apiUrl, this.collection, ...parts].filter(p => !!p).join('/');
    }

    getMany() {
        return this.http.get<PaginatedEntity[]>(
            this.composeUrl(),
        ).pipe(this.responsePipe());
    }

    getOne(id: string) {
        return this.http.get<Entity>(
            this.composeUrl(id),
        ).pipe(this.responsePipe());
    }

    patchOne(id: string) {
        return this.http.patch<Entity>(
            this.composeUrl(id),
        ).pipe(this.responsePipe());
    }

    putOne(id: string, data: any) {
        return this.http.put<Entity>(
            this.composeUrl(id),
            data,
        ).pipe(this.responsePipe());
    }

    postOne(data: any) {
        return this.http.post<Entity>(
            this.composeUrl(),
            data,
        ).pipe(this.responsePipe());
    }

    deleteOne(id: string) {
        return this.http.delete<void>(
            this.composeUrl(id),
        ).pipe(
            this.responsePipe(),
            mapTo(undefined),
        );
    }

    private responsePipe<In extends CrudResponse<any>>() {
        return pipe(
            map(response => response.data as CrudResponse<In['data']>),
        ) as UnaryFunction<Observable<In>, Observable<CrudResponse<In['data']>>>;
    }

}
