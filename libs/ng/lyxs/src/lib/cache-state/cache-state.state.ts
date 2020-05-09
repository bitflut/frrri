import { Injectable, Injector } from '@angular/core';
import { DataAction } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { DataStateClass } from '@ngxs-labs/data/typings';
import { StatesRegistryService } from '../states-registry/states-registry.service';

@Injectable()
export class CacheState<T> extends NgxsDataRepository<T> {

    private statesRegistry = this.injector.get<StatesRegistryService>(StatesRegistryService);

    constructor(protected injector: Injector) {
        super();
    }

    @DataAction()
    public reset(): void {
        super.reset();
        const meta = this.constructor as DataStateClass;
        for (const child of meta.NGXS_META.children) {
            const childFacade = this.statesRegistry.getByPath(child.NGXS_META.path);
            childFacade.resetPopulations();
        }
    }

}
