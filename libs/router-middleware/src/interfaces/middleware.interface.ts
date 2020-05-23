import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Platform } from '@frrri/router-middleware/internal';
import { Observable } from 'rxjs';

export interface Middleware<T = any> {
    platforms: Platform[];
    operate(operation: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T;
}
