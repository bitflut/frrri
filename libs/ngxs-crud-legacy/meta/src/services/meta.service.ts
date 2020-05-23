import { Injectable, Injector } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { CrudCollectionState } from '@frrri/ngxs-crud';
import { StatesRegistryService } from '@frrri/ngxs-crud/registry';
import { EMPTY } from 'rxjs';
import { catchError, filter, take, timeout } from 'rxjs/operators';
import { META_INSTRUCTION } from '../constants';
import { MetaInstructionType } from '../enums/meta-instruction.enum';
import { ActiveMeta } from '../instructions/active-meta.instruction';
import { StaticMeta } from '../instructions/static-meta.instruction';
import { MetaInstruction } from '../types/meta-instruction.type';

@Injectable()
export class MetaService {

    protected registryService = this.injector.get(StatesRegistryService);
    protected metaService = this.injector.get(Meta);
    protected titleService = this.injector.get(Title);
    private defaultTitle = this.titleService.getTitle();

    constructor(protected injector: Injector) { }

    async update(data: MetaInstruction) {
        const meta = data[META_INSTRUCTION];

        if (!meta) {
            this.defaultMeta();
            return;
        }

        switch (meta.type) {
            case MetaInstructionType.Static:
                return this.renderMeta(meta);
            case MetaInstructionType.Active:
                return this.activeMeta(meta);
        }
    }

    private defaultMeta() {
        this.renderMeta({ title: this.defaultTitle });
    }

    private renderMeta(meta: StaticMeta) {
        this.titleService.setTitle(meta.title);
    }

    private async activeMeta(meta: ActiveMeta) {
        const facade = this.registryService.getByPath<CrudCollectionState>(meta.statePath);
        const active = await facade.active$
            .pipe(
                timeout(12000),
                filter(a => !!a),
                take(1),
                catchError(e => {
                    console.error(e);
                    console.warn(`TIMEOUT ERROR: Could not find active entity in \`${meta.statePath}\` within timeout. Did you forget to use getActive in your routing instructions?`);
                    return EMPTY;
                }),
            ).toPromise();

        this.renderMeta(
            meta.factory(active),
        );
    }

}
