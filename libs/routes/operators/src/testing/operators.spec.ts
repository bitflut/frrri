import { Component } from '@angular/core';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { frrri, FrrriModule, FRRRI_MIDDLEWARE, Middleware, operate, Platform } from '@frrri/routes';
import { of } from 'rxjs';
import { getActive } from '../crud/operators/get-active.operator';
import { getMany } from '../crud/operators/get-many.operator';
import { populate } from '../crud/operators/populate.operator';
import { reset } from '../crud/operators/reset.operator';

class MyMiddleware1 implements Middleware {
    platforms = [Platform.Resolver];

    operate(operation: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const name = 'Resolver 1';
        return of(`${name} ${operation.type} ${operation?.statePath}`);
    }
}
class MyMiddleware2 implements Middleware {
    platforms = [Platform.Resolver];

    operate(operation: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const name = 'Resolver 2';
        if (operation.type === 'reset') { return; }
        return of(`${name} ${operation.type} ${operation?.statePath}`);
    }
}

const all = 'entities';
const posts = 'entities.posts';
const comments = 'entities.comments';
const users = 'entities.users';

describe('Operatos', () => {

    @Component({ template: '<router-outlet></router-outlet>' })
    class AppComponent { }

    @Component({ template: 'posts-component' })
    class PostsComponent { }

    @Component({ template: 'post-component' })
    class PostComponent { }

    const routes: Routes = [
        {
            path: '',
            component: PostsComponent,
            data: operate(
                reset(all),
                getMany(posts),
            ),
            children: [
                {
                    path: ':id',
                    component: PostComponent,
                    data: operate(
                        getActive(posts),
                        populate({
                            from: posts,
                            to: comments,
                        }),
                        populate({
                            from: comments,
                            to: users,
                        }),
                    ),
                },
            ],
        },
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                FrrriModule.forRoot(),
                RouterTestingModule.withRoutes(
                    frrri(routes),
                ),
            ],
            declarations: [
                AppComponent,
                PostComponent,
                PostsComponent,
            ],
            providers: [
                {
                    provide: FRRRI_MIDDLEWARE,
                    multi: true,
                    useClass: MyMiddleware1,
                },
                {
                    provide: FRRRI_MIDDLEWARE,
                    multi: true,
                    useClass: MyMiddleware2,
                },
            ],
        }).compileComponents();
    });

    it('should call resolvers', fakeAsync(inject(
        [Router, FRRRI_MIDDLEWARE],
        async (router: Router, middlewares: Middleware[]) => {
            middlewares.map(r => spyOn(r, 'operate').and.callThrough());

            router.initialNavigation();
            tick();

            router.navigateByUrl('/1');
            tick();
        },
    )));

});
