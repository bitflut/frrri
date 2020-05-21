import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Platform } from '../enums/platform.enum';

export interface Middleware<T = any> {
    platforms: Platform[];
    operate(operation: any, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<T> | Promise<T> | T;
}
