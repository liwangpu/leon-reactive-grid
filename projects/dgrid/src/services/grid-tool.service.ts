import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import { IGridState, initializeGridData, SingleValue, changePagination } from '../state-store';

@Injectable()
export class GridToolService {

    public readonly gridId: string;
    public constructor(private store: Store<IGridState>) {
        this.gridId = `${uuidv4()}##${Date.now()}`;
        this.store.dispatch(initializeGridData(SingleValue.from(this.gridId)));
        // console.log(1, this.gridId);
    }


    public changePagination(page: number, limit: number) {
        this.store.dispatch(changePagination({ id: this.gridId, page, limit }));
    }

}
