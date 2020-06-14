import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as fromStore from '../grid-store';
import { map, switchMap, tap } from 'rxjs/operators';
import * as fromModel from '../models';

@Injectable()
export class GridEffectService {

    public constructor(
        private actions$: Actions
    ) { }

    // loadData$ = this.actions$
    //     .pipe(ofType(fromStore.loadData))

    loadData$ = createEffect(() => this.actions$
        // .pipe(ofType(fromStore.loadData))
        // .pipe(switchMap(pa => this.dstore.onQuery({})))
        .pipe(tap(res=>{
            console.log('effect work',res);
        }))
    );

}
