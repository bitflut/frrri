import { Component } from '@angular/core';
import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, Routes } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { Platform } from '@frrri/router-middleware/internal';
import { of } from 'rxjs';
import { FRRRI_MIDDLEWARE } from '../constants';
import { MiddlewareFactory } from '../factories/middleware.factory';
import { frrri } from '../frrri';
import { FrrriModule } from '../frrri.module';
import { Middleware } from '../interfaces/middleware.interface';

function MiddlewareTestingFactory(id: string | number, platforms: Platform[]) {
    class MyMiddleware extends MiddlewareFactory(...platforms) implements Middleware {
        operate(operation: any, platform: Platform, route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
            const name = `${platform} Resolver ${id} --> ${operation}`;
            return of(name);
        }
    }

    return MyMiddleware;
}

describe('Platform', () => {

    class Resolver1 extends MiddlewareTestingFactory(1, [Platform.NavigationEnd]) { }
    class Resolver2 extends MiddlewareTestingFactory(2, [Platform.Resolver]) { }

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
            children: [
                {
                    path: ':id',
                    component: PostComponent,
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
                    useClass: Resolver1,
                },
                {
                    provide: FRRRI_MIDDLEWARE,
                    multi: true,
                    useClass: Resolver2,
                },
            ],
        }).compileComponents();
    });

    it('should provide middleware', inject(
        [FRRRI_MIDDLEWARE],
        (frrriMiddleware: any) => {
            expect(Array.isArray(frrriMiddleware)).toBeTruthy();
            expect(frrriMiddleware.length).toEqual(2);
        },
    ));

    it('should not call middleware without operators', fakeAsync(inject(
        [Router, FRRRI_MIDDLEWARE],
        async (router: Router, frrriMiddleware: Middleware<any>[]) => {
            const spies = frrriMiddleware.map(r => spyOn(r, 'operate').and.callThrough());
            router.initialNavigation();
            tick();
            for (const spy of spies) {
                expect(spy).toHaveBeenCalledTimes(0);
            }
        },
    )));

});
