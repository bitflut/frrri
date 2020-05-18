import { Injectable, Injector } from '@angular/core';
import { StatesRegistryService } from '@lyxs/ngxs-crud/registry';
import { DataAction } from '@ngxs-labs/data/decorators';
import { NgxsDataRepository } from '@ngxs-labs/data/repositories';
import { DataStateClass } from '@ngxs-labs/data/typings';

interface Resettable {
    resetPopulations?: any;
}

@Injectable()
export class CrudEntitiesState<T = any> extends NgxsDataRepository<T> {

    private statesRegistry = this.injector.get<StatesRegistryService<Resettable>>(StatesRegistryService);

    constructor(protected injector: Injector) {
        super();
    }

    @DataAction()
    public reset(): void {
        super.reset();
        const meta = this.constructor as DataStateClass;
        for (const child of meta.NGXS_META.children) {
            const childFacade = this.statesRegistry.getByPath(child.NGXS_META.path);
            if (typeof childFacade.resetPopulations === 'function') {
                childFacade.resetPopulations();
            }
        }
    }

}