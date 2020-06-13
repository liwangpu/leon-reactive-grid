import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import * as fromStore from '../grid-store';
import * as fromModel from '../models';
import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';



@Injectable()
export class GridStoreService {

    public readonly gridId: string;
    private _views$: Observable<any>;
    private _activeViewId$: Observable<string>;
    private _activeColumns$: Observable<Array<fromModel.ITableColumn>>;
    private _datas$: Observable<Array<any>>;
    public constructor(private store: Store<fromStore.IGridState>) {
        // this.gridId = `${uuidv4()}##${Date.now()}`;
        this.gridId = `${Date.now()}`;
        // this.store.dispatch(fromStore.initGrid({ id: this.gridId }));
    }

    public get activeViewId$(): Observable<string> {
        if (!this._activeViewId$) {
            this._activeViewId$ = this.store.select(fromStore.selectActiveViewId(this.gridId));
        }
        return this._activeViewId$;
    }

    public get activeColumns$(): Observable<Array<fromModel.ITableColumn>> {
        if (!this._activeColumns$) {
            this._activeColumns$ = this.store.select(fromStore.selectActiveColumns(this.gridId)).pipe(filter(x => x));
        }
        return this._activeColumns$;
    }

    public get views$(): Observable<any> {
        if (!this._views$) {
            this._views$ = this.store.select(fromStore.selectViews(this.gridId)).pipe(filter(x => x));
        }
        return this._views$;
    }

    public get datas$(): Observable<Array<any>> {
        if (!this._datas$) {
            this._datas$ = this.store.select(fromStore.selectDatas(this.gridId)).pipe(filter(x => x));
        }
        return this._datas$;
    }

    public initViews(views: Array<fromModel.IFilterView>): void {
        this.store.dispatch(fromStore.initViews({ id: this.gridId, views }));
    }

    public changeActiveView(viewId: string): void {
        this.store.dispatch(fromStore.changeActiveView({ id: this.gridId, viewId }));
    }

    public changePagination(page: number, limit: number): void {
        this.store.dispatch(fromStore.changePagination({ id: this.gridId, page, limit }));
    }

    public setDatas(datas: Array<any>): void {
        this.store.dispatch(fromStore.setDatas({ id: this.gridId, datas }));
    }

    public openFilterPanel(): void {

    }

    public freezenColumn(field: string): void {
        this.store.dispatch(fromStore.freezenColumn({ id: this.gridId, field }));
    }

    public unFreezenColumn(field: string): void {
        this.store.dispatch(fromStore.unFreezenColumn({ id: this.gridId, field }));
    }

    public changeColumnWidth(obj: { [key: string]: number }): void {
        this.store.dispatch(fromStore.changeColumnWidth({ id: this.gridId, obj }));
    }
}
