import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxsCrudActiveModule, NgxsCrudManyModule, NgxsCrudOneModule } from '@frrri/ngxs-crud/ui';
import { EntitiesStateModule } from '../+state/entities-state.module';
import { PostsIndexComponent } from './posts-index/posts-index.component';
import { PostsRoutingModule } from './posts-routing.module';
import { PostsShowComponent } from './posts-show/posts-show.component';

@NgModule({
    declarations: [PostsIndexComponent, PostsShowComponent],
    imports: [
        CommonModule,
        PostsRoutingModule,
        EntitiesStateModule,
        NgxsCrudManyModule,
        NgxsCrudActiveModule,
        NgxsCrudOneModule,
    ],
})
export class PostsModule { }
