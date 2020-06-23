import { Injectable, OnDestroy } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { Store } from '@ngrx/store';
import * as fromStore from '../grid-store';
import * as fromModel from '../models';
import { Observable } from 'rxjs';
import { filter, map, first } from 'rxjs/operators';
import * as fromConst from '../consts';
import { Actions, ofType } from '@ngrx/effects';
import { SubSink } from 'subsink';
import * as queryString from 'query-string';
import { Location } from '@angular/common';
import * as fromUtils from '../utils';

function snapshot(obs: Observable<any>): Promise<any> {
    return obs.pipe(first()).toPromise();
}

@Injectable()
export class GridStoreService implements OnDestroy {

    public readonly gridId: string;
    private enableUrlHistory: boolean;
    private subs = new SubSink();
    public constructor(
        private dstore: fromModel.DStore,
        private store: Store<fromStore.IGridState>,
        private location: Location,
        private actions$: Actions
    ) {
        this.gridId = `${uuidv4().replace(/-/g, '').toUpperCase()}--${Date.now()}`;
        // effects
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.initGrid), first()).subscribe(async ({ option, queryParams }) => {
            this.enableUrlHistory = option?.enableUrlHistory;
            await this.loadViews();
            this.changeActiveView(queryParams.viewId, true);
        });
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.refreshGrid)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.changeActiveView)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.changePagination)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.changeSort)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.setSearchKeyword)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.resetView)).subscribe(() => this.loadData());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.saveViewAs)).subscribe(async ({ viewName }) => await this._saveAsView(viewName));
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.changeColumnWidth)).subscribe(async () => await this._saveCurrentView());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.freezenColumn)).subscribe(async () => await this._saveCurrentView());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.unFreezenColumn)).subscribe(async () => await this._saveCurrentView());
        this.subs.sink = this.actions$.pipe(this.byGrid(), ofType(fromStore.toggleColumnVisible)).subscribe(async () => await this._saveCurrentView());
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

    public get sort$(): Observable<fromModel.ISortEvent> {
        return this.store.select(fromStore.selectSort(this.gridId));
    }

    public get pagination$(): Observable<{ page: number, limit: number }> {
        return this.store.select(fromStore.selectPagination(this.gridId)).pipe(filter(x => x));
    }

    public get rowsPerPageOptions$(): Observable<Array<number>> {
        return this.store.select(fromStore.selectRowsPerPageOptions(this.gridId)).pipe(filter(x => x));
    }

    public initGrid(option?: fromModel.DStoreOption, queryParams?: { [key: string]: any }): void {
        this.store.dispatch(fromStore.initGrid({ id: this.gridId, option, queryParams }));
    }

    public refreshGrid(queryParams?: { [key: string]: any }): void {
        this.store.dispatch(fromStore.refreshGrid({ id: this.gridId, queryParams }));
    }

    public loadData(): void {
        this.store.dispatch(fromStore.loadData({ id: this.gridId }));
    }

    public changeActiveView(viewId?: string, initial?: boolean): void {
        this.store.dispatch(fromStore.changeActiveView({ id: this.gridId, viewId, initial }));
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

    public changeColumnOrder(columns: Array<fromModel.ITableColumn>): void {
        this.store.dispatch(fromStore.changeColumnOrder({ id: this.gridId, columns }));
    }

    public changeSort(sort: fromModel.ISortEvent): void {
        this.store.dispatch(fromStore.changeSort({ id: this.gridId, sort }));
    }

    public saveViewAs(viewName: string): void {
        this.store.dispatch(fromStore.saveViewAs({ id: this.gridId, viewName }));
    }

    public saveView(): void {
        this.store.dispatch(fromStore.saveView({ id: this.gridId }));
    }

    public saveViewAndLoadData(filters: Array<fromModel.IFilter>): void {
        this.store.dispatch(fromStore.saveViewAndLoadData({ id: this.gridId, filters }));
    }

    public setSearchKeyword(keyword: string): void {
        this.store.dispatch(fromStore.setSearchKeyword({ id: this.gridId, keyword }));
    }

    public resetView(): void {
        this.store.dispatch(fromStore.resetView({ id: this.gridId }));
    }

    public updateFilters(filters: Array<fromModel.IFilter>): void {
        this.store.dispatch(fromStore.updateFilters({ id: this.gridId, filters }));
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
        await this.dstore.onFilterViewUpdate(view);
        await this.loadViews();
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
        await this.loadViews();
        this.changeActiveView(view.id);
    }

    private async _queryData(): Promise<void> {
        let view: fromModel.IFilterView = await snapshot(this.activeView$);
        let pagination = await snapshot(this.pagination$);
        let sorting: fromModel.ISortEvent = await snapshot(this.sort$);
        let keyword = await snapshot(this.searchKeyword$);
        let queryParam: fromModel.IQueryParam = {
            pagination
        };

        if (view.id !== fromConst.DEFAULT_VIEW_ID) {
            queryParam.viewId = view.id;
        }
        if (keyword) {
            queryParam.keyword = keyword;
        }
        if (sorting && sorting.field && sorting.direction) {
            queryParam.sorting = sorting;
        }
        if (view.filters) {
            queryParam.filters = view.filters.filter(f => f.operator);
        }
        let result = await this.dstore.onQuery(queryParam);
        if (this.enableUrlHistory) { this.recordUrlHistory(queryParam); }
        this.setDatas(result.items, result.count);
    }

    private async loadViews(): Promise<void> {
        let cols = await this.dstore.getColumns();
        let views = await this.dstore.getFilterViews();
        // 如果view为空,用column生成一个默认的view
        if (!views.some(x => x.id === fromConst.DEFAULT_VIEW_ID)) {
            views.unshift({ id: fromConst.DEFAULT_VIEW_ID, name: fromConst.DEFAULT_VIEW_NAME, columns: cols });
        }
        this.store.dispatch(fromStore.setViews({ id: this.gridId, views }));
    }

    private async recordUrlHistory(queryParam: fromModel.IQueryParam): Promise<void> {
        let url = fromUtils.UrlTool.getPathAndQuery(location.href);
        let urlArr = url.split('?');
        let originQueryObj = fromUtils.parseUrlQueryParams(url);
        let currentQueryObj = fromUtils.tranferQueryParams(queryParam)
        // console.log('origin', originQueryObj, queryString.stringify(originQueryObj));
        // console.log('current', currentQueryObj, queryString.stringify(currentQueryObj));
        if (queryString.stringify(originQueryObj) !== queryString.stringify(currentQueryObj)) {
            // console.log('不一样');
            this.location.go(`${urlArr[0]}?${queryString.stringify(currentQueryObj)}`);
        }
    }

    private byGrid(): any {
        return filter(x => x['id'] === this.gridId);
    }
}
