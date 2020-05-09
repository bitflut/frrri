import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CollectionComponent } from './collection.component';

@NgModule({
    imports: [CommonModule],
    declarations: [CollectionComponent],
    exports: [CollectionComponent],
})
export class LyxsCollectionModule { }
