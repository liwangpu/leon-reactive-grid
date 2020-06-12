import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import * as fromStore from '../grid-store';
import { addGrid } from '../grid-store/action';

@Injectable()
export class GridToolService {

    public readonly gridId: string;
    public constructor(private store: Store<fromStore.GridState>) {
        this.gridId = `${uuidv4()}##${Date.now()}`;
        // this.store.dispatch(initializeGridData(SingleValue.from(this.gridId)));
        this.store.dispatch(addGrid({ grid: { id: this.gridId } }));
    }


    public changePagination(page: number, limit: number) {
        // this.store.dispatch(changePagination({ id: this.gridId, page, limit }));
    }

}
