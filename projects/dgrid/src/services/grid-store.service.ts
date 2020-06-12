import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import * as fromStore from '../grid-store';
import * as fromModel from '../models';

@Injectable()
export class GridStoreService {

    public readonly gridId: string;
    public constructor(private store: Store<fromStore.IGridState>) {
        this.gridId = `${uuidv4()}##${Date.now()}`;
        this.store.dispatch(fromStore.initGrid({ id: this.gridId }));
        // console.log(1, this.gridId);
    }

    public initViews(views: Array<fromModel.IFilterView>): void {
        this.store.dispatch(fromStore.initViews({ id: this.gridId, views }));
    }


    public changePagination(page: number, limit: number): void {
        this.store.dispatch(fromStore.changePagination({ id: this.gridId, page, limit }));
    }

}
