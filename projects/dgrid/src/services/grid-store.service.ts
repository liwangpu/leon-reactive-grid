import { Injectable, OnDestroy, Inject } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import * as fromStore from '../grid-store';
import * as fromModel from '../models';
import { Observable } from 'rxjs';
import { filter, map, first, skip } from 'rxjs/operators';
import * as fromConst from '../consts';
import { Actions, ofType } from '@ngrx/effects';
import { SubSink } from 'subsink';
import * as  fromToken from '../tokens';


function snapshot(obs: Observable<any>): Promise<any> {
    return obs.pipe(first()).toPromise();
}

@Injectable()
export class GridStoreService implements OnDestroy {

    public readonly gridId: string;
    private subs = new SubSink();
    public constructor(
        @Inject(fromToken.GRIDCONFIG)
        private config: fromToken.IGridConfig,
        private dstore: fromModel.DStore,
        private store: Store<fromStore.IGridState>,
        private actions$: Actions
    ) {
        this.gridId = `${uuidv4().replace(/-/g, '').toUpperCase()}--${Date.now()}`;
        // effects
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.initGrid), first()).subscribe(async ({ option }) => {
            let cols = await this.dstore.getColumns();
            let views = await this.dstore.getFilterViews();
            // 如果view为空,用column生成一个默认的view
            if (!views.some(x => x.id === fromConst.DEFAULT_VIEW_ID)) {
                views.unshift({ id: fromConst.DEFAULT_VIEW_ID, name: fromConst.DEFAULT_VIEW_NAME, columns: cols });
            }
            this.store.dispatch(fromStore.setRowsPerPageOptions({ id: this.gridId, option: this.config.rowsPerPageOptions }));
            this.store.dispatch(fromStore.setViews({ id: this.gridId, views }));
            this.changeActiveView();
        });
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.refreshGrid), skip(1)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.changeActiveView)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.changePagination)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.setSearchKeyword)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.resetView)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.saveViewAs)).subscribe(async ({ viewName }) => await this._saveAsView(viewName));
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.changeColumnWidth)).subscribe(async () => await this._saveCurrentView());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.saveView)).subscribe(async () => await this._saveCurrentView());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.saveViewAndLoadData)).subscribe(async () => {
            await this._saveCurrentView();
            this.loadData();
        });
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.loadData)).subscribe(async () => await this._queryData());
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
        this.store.dispatch(fromStore.clearStoreData({ id: this.gridId }));
    }

    public get activeView$(): Observable<fromModel.IFilterView> {
        return this.store.select(fromStore.selectActiveView(this.gridId));
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

    public get dataCount$(): Observable<number> {
        return this.store.select(fromStore.selectDataCount(this.gridId));
    }

    public get advanceSettingPanel$(): Observable<string> {
        return this.store.select(fromStore.selectAdvanceSettingPanel(this.gridId));
    }

    public get viewMode$(): Observable<boolean> {
        return this.store.select(fromStore.selectViewMode(this.gridId)).pipe(map(x => x ? true : false));
    }

    public get searchKeyword$(): Observable<string> {
        return this.store.select(fromStore.selectSearchKeyword(this.gridId));
    }

    public get pagination$(): Observable<{ page: number, limit: number }> {
        return this.store.select(fromStore.selectPagination(this.gridId)).pipe(filter(x => x));
    }

    public initGrid(option?: fromModel.DStoreOption): void {
        this.store.dispatch(fromStore.initGrid({ id: this.gridId, option }));
    }

    public refreshGrid(history?: fromModel.IHistory): void {
        this.store.dispatch(fromStore.refreshGrid({ id: this.gridId, history }));
    }

    public loadData(): void {
        this.store.dispatch(fromStore.loadData({ id: this.gridId }));
    }

    // public setViews(views: Array<fromModel.IFilterView>): void {
    //     this.store.dispatch(fromStore.setViews({ id: this.gridId, views }));
    // }

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

    // public setRowsPerPageOptions(option: Array<number>): void {
    //     this.store.dispatch(fromStore.setRowsPerPageOptions({ id: this.gridId, option }));
    // }

    public changeColumnOrder(fields: Array<string>): void {
        this.store.dispatch(fromStore.changeColumnOrder({ id: this.gridId, fields }));
    }

    public changeViewMode(enable?: boolean): void {
        this.store.dispatch(fromStore.changeViewMode({ id: this.gridId, enable }));
    }

    public saveViewAs(viewName: string): void {
        this.store.dispatch(fromStore.saveViewAs({ id: this.gridId, viewName }));
    }

    public saveView(): void {
        this.store.dispatch(fromStore.saveView({ id: this.gridId }));
    }

    public saveViewAndLoadData(): void {
        this.store.dispatch(fromStore.saveViewAndLoadData({ id: this.gridId }));
    }

    public setSearchKeyword(keyword: string): void {
        this.store.dispatch(fromStore.setSearchKeyword({ id: this.gridId, keyword }));
    }

    public resetView(): void {
        this.store.dispatch(fromStore.resetView({ id: this.gridId }));
    }

    private async _saveCurrentView(): Promise<void> {
        let activeView = await snapshot(this.activeView$);
        if (activeView.id === fromConst.DEFAULT_VIEW_ID) {
            return;
        }
        let activeColumns = await snapshot(this.activeColumns$);

        let columns = [...activeColumns];
        // 清除100默认高度
        for (let idx = columns.length - 1; idx >= 0; idx--) {
            if (columns[idx].width > 100) { continue; }
            let col = { ...columns[idx] };
            col.width = col.width > 100 ? col.width : null;
            columns[idx] = col;
        }
        let view = { ...activeView, columns: columns };

        console.log(1, view);
    }

    private async _saveAsView(viewName: string): Promise<void> {
        let activeView = await snapshot(this.activeView$);
        let activeColumns = await snapshot(this.activeColumns$);

        let columns = [...activeColumns];
        // 清除100默认高度
        for (let idx = columns.length - 1; idx >= 0; idx--) {
            if (columns[idx].width > 100) { continue; }
            let col = { ...columns[idx] };
            col.width = col.width > 100 ? col.width : null;
            columns[idx] = col;
        }
        let view = { ...activeView, id: null, name: viewName, columns: columns };
        view = await this.dstore.onFilterViewCreate(view);
        // await this.loadView();
        this.changeActiveView(view.id);
    }

    private async _queryData(): Promise<void> {
        let viewId = await snapshot(this.activeViewId$);
        let pagination = await snapshot(this.pagination$);
        let keyword = await snapshot(this.searchKeyword$);

        // console.log('query data', keyword, pagination);
        let history: fromModel.IHistory = {
            viewId: viewId !== fromConst.DEFAULT_VIEW_ID ? viewId : null,
            keyword,
            pagination
        };
        let result = await this.dstore.onQuery(history);
        this.setDatas(result.items, result.count);
    }

    private byGrid(): any {
        return filter(x => x['id'] === this.gridId);
    }
}
