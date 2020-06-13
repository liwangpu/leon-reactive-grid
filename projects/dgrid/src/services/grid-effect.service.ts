import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import * as fromStore from '../grid-store';
import { map, switchMap, tap } from 'rxjs/operators';
import * as fromModel from '../models';
import { GridStoreService } from './grid-store.service';
import { DStore } from '../models';


@Injectable()
export class GridEffectService {

    public constructor(
        private actions$: Actions,
        private dstore: DStore
    ) { }

    // loadData$ = this.actions$
    //     .pipe(ofType(fromStore.loadData))

    loadData$ = createEffect(() => this.actions$
        .pipe(ofType(fromStore.loadData))
        .pipe(switchMap(pa => this.dstore.onQuery({})))
        .pipe(tap(res=>{
            console.log('effect work',res);
        }))
        .pipe(map((res: fromModel.IQueryResult) => ({ type: 'mytest', payload: [] })))
    );

}
