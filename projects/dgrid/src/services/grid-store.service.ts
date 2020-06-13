import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import * as fromStore from '../grid-store';
import * as fromModel from '../models';
import { Observable, from } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import * as fromConst from '../consts';



@Injectable()
export class GridStoreService {

    public readonly gridId: string;
    private _views$: Observable<any>;
    private _activeViewId$: Observable<string>;
    private _activeColumns$: Observable<Array<fromModel.ITableColumn>>;
    private _datas$: Observable<Array<any>>;
    public constructor(
        private dstore: fromModel.DStore,
        private store: Store<fromStore.IGridState>
    ) {
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

    public async loadView(): Promise<void> {
        let cols = await this.dstore.getColumns();
        let views = await this.dstore.getFilterViews();
        // let result = await this.dstore.onQuery({});
        // 如果view为空,用column生成一个默认的view
        if (!views.length) {
            views.push({ id: fromConst.DEFAULT_VIEW_ID, name: fromConst.DEFAULT_VIEW_NAME, columns: cols });
        }
        this.initViews(views);
    }

    public async loadData(): Promise<void> {
        // this.store.dispatch(fromStore.loadData({ id: this.gridId }));
        // console.log('load data',this.store.value);
        let pagination = await this.store.select(fromStore.selectPagination(this.gridId)).pipe(take(1)).toPromise();

        let result = await this.dstore.onQuery();
        this.setDatas(result.items, result.count);
    }

    public initViews(views: Array<fromModel.IFilterView>): void {
        this.store.dispatch(fromStore.initViews({ id: this.gridId, views }));
    }

    public changeActiveView(viewId?: string): void {
        this.store.dispatch(fromStore.changeActiveView({ id: this.gridId, viewId }));
    }

    public changePagination(page: number, limit: number): void {
        this.store.dispatch(fromStore.changePagination({ id: this.gridId, page, limit }));
    }

    public setDatas(datas: Array<any>, count?: number): void {
        this.store.dispatch(fromStore.setDatas({ id: this.gridId, datas, count }));
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
