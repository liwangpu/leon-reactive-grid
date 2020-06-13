// import { InjectionToken } from '@angular/core';
// import { Observable } from 'rxjs';

import { Observable } from 'rxjs';
import { Actions } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';

// export interface IGridEffect {
//     loadData$: Observable<any>;
// }

// export const GRIDEFFECT: InjectionToken<IGridEffect> = new InjectionToken<IGridEffect>('grid effect');

@Injectable()
export class GridEffect {

    public constructor(
        private actions$: Actions
    ) { }

    loadData$: Observable<any> = this.actions$.pipe(tap(re => {
        console.log('fff', re);
    }));
}