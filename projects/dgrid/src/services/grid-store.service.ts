import { Injectable, OnDestroy } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import * as fromStore from '../grid-store';
import * as fromModel from '../models';
import { Observable, from } from 'rxjs';
import { filter, take, tap, map } from 'rxjs/operators';
import * as fromConst from '../consts';
import { Actions, ofType } from '@ngrx/effects';
import { SubSink } from 'subsink';



@Injectable()
export class GridStoreService implements OnDestroy {

    public readonly gridId: string;
    private subs = new SubSink();
    public constructor(
        private dstore: fromModel.DStore,
        private store: Store<fromStore.IGridState>,
        private actions$: Actions
    ) {
        this.gridId = `${uuidv4().replace(/-/g, '').toUpperCase()}--${Date.now()}`;

        this.subs.sink = this.actions$
            .pipe(ofType(fromStore.loadData), filter(x => x.id === this.gridId))
            .subscribe(async () => {
                // console.log('load data');
                let pagination = await this.store.select(fromStore.selectPagination(this.gridId)).pipe(take(1)).toPromise();
                let result = await this.dstore.onQuery();
                this.setDatas(result.items, result.count);
            });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.store.dispatch(fromStore.clearStoreData({ id: this.gridId }));
    }

    public get activeViewId$(): Observable<string> {
        return this.store.select(fromStore.selectActiveViewId(this.gridId));
    }

    public get activeColumns$(): Observable<Array<fromModel.ITableColumn>> {
        return this.store.select(fromStore.selectActiveColumns(this.gridId)).pipe(filter(x => x));
    }

    public get views$(): Observable<any> {
        return this.store.select(fromStore.selectViews(this.gridId)).pipe(filter(x => x));
    }

    public get datas$(): Observable<Array<any>> {
        return this.store.select(fromStore.selectDatas(this.gridId)).pipe(filter(x => x));
    }

    public get advanceSettingPanel$(): Observable<string> {
        return this.store.select(fromStore.selectAdvanceSettingPanel(this.gridId));
    }

    public get viewMode$(): Observable<boolean> {
        return this.store.select(fromStore.selectViewMode(this.gridId)).pipe(map(x => x ? true : false));
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
        this.store.dispatch(fromStore.loadData({ id: this.gridId }));
        // console.log('load data',this.store.value);
        // let pagination = await this.store.select(fromStore.selectPagination(this.gridId)).pipe(take(1)).toPromise();

        // let result = await this.dstore.onQuery();
        // this.setDatas(result.items, result.count);
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

    public changeAdvanceSettingPanel(panel?: string): void {
        this.store.dispatch(fromStore.changeAdvanceSettingPanel({ id: this.gridId, panel }));
    }

    public toggleColumnVisible(field: string): void {
        this.store.dispatch(fromStore.toggleColumnVisible({ id: this.gridId, field }));
    }

    public changeColumnOrder(fields: Array<string>): void {
        this.store.dispatch(fromStore.changeColumnOrder({ id: this.gridId, fields }));
    }

    public changeViewMode(enable?: boolean): void {
        this.store.dispatch(fromStore.changeViewMode({ id: this.gridId, enable }));
    }
}
