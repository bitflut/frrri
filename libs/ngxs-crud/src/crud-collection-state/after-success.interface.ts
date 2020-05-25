import { OperationContext } from '@frrri/ngxs-crud/internal';
import { Observable } from 'rxjs';

export interface AfterSuccess<Entity = any> {

    /** Will run after every successful operation */
    afterSuccess(data: Entity | Entity[], operation: OperationContext): void | Observable<any>;

}
