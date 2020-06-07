import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataFlowTopicEnum } from '../enums/data-flow-topic.enum';
import { MessageFlowEnum } from '../enums/message-flow.enum';
import { IFilterView } from '../models/i-filter-view';
import { IHistory } from '../models/i-history';
import { ISelectOption } from '../models/i-select-option';
import { ITableColumn } from '../models/i-table-column';
import { GRIDCONFIG, IGridConfig } from '../tokens/grid-config';
import { ArrayTool } from '../utils/array-tool';
import { dataMap, topicFilter, topicFilters, topicMap } from '../utils/grid-tool';
import { ObjectTool } from '../utils/object-tool';
import { GridDataFlowService } from './grid-data-flow.service';
import { GridMessageFlowService } from './grid-message-flow.service';

@Injectable()
export class GridDataService {

    public fieldInfos: { [key: string]: Array<ISelectOption> };
    private history: IHistory = { pagination: {}, sorting: {}, keyword: null };
    private filterViews: Array<IFilterView> = [];
    private filterPanelIsOpenState: boolean = false;
    public constructor(
        @Inject(GRIDCONFIG) private gridConfig: IGridConfig,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService
    ) {
        const viewDefinitionObs: Observable<Array<IFilterView>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap);
        const filterPanelStateObs: Observable<boolean> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.ToggleFilterSettingPanel), dataMap);

        viewDefinitionObs
            .subscribe((views: Array<IFilterView>) => {
                this.filterViews = ArrayTool.deepCopy(views);
            });

        filterPanelStateObs
            .subscribe(open => {
                if (typeof open === 'undefined') {
                    this.filterPanelIsOpenState = !this.filterPanelIsOpenState;
                    return;
                }
                this.filterPanelIsOpenState = open;
            });
    }

    public getFilterPanelState(): boolean {
        return this.filterPanelIsOpenState;
    }

    public getHistory(): IHistory {
        return ObjectTool.deepCopy(this.history);
    }

    public getActiveFilterViewColumns(): Array<ITableColumn> {
        const view: IFilterView = this._getActiveFilterView();
        return ObjectTool.deepCopy(view.columns);
    }

    public getActiveFilterView(): IFilterView {
        return ObjectTool.deepCopy(this._getActiveFilterView());
    }

    public getFilterViews(): Array<IFilterView> {
        return ObjectTool.deepCopy(this.filterViews);
    }

    public setFilterView(view: IFilterView): void {
        let v: IFilterView = ObjectTool.deepCopy(view);
        let index: number = this.filterViews.findIndex(x => x.id === v.id);
        if (index > -1) {
            this.filterViews[index] = v;
            return;
        }
        this.filterViews.push(v);
    }

    public setActiveViewId(viewId: string): void {
        this.history.viewId = viewId;
    }

    public setKeyword(keyword?: string): void {
        this.history.keyword = keyword;
    }

    public freezeColumn(field: string): void {
        let view: IFilterView = this._getActiveFilterView();
        const cols: Array<ITableColumn> = view.columns;
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].field == field) {
                let it: ITableColumn = cols[i];
                it['_frozen'] = true;
                break;
            }
        }
        // this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view, fetchData: false });
    }

    public unfreezenColumn(field: string): void {
        let view: IFilterView = this._getActiveFilterView();
        const cols: Array<ITableColumn> = view.columns;
        for (let i: number = 0; i < cols.length; i++) {
            if (cols[i].field == field) {
                let it: ITableColumn = cols[i];
                it['_frozen'] = false;
                break;
            }
        }
        // console.log('v', view);
        // this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view, fetchData: false });
    }

    public setPagination(page?: number, limit?: number): void {
        this.history.pagination.page = page;
        this.history.pagination.limit = limit;
        // this.dataFlow.publish(DataFlowTopicEnum._History, this.history);
    }

    public setSorting(field: string, direction?: string): void {
        this.history.sorting.field = field;
        this.history.sorting.direction = direction;
        // this.dataFlow.publish(DataFlowTopicEnum._History, this.history);
    }

    public initializeHistory(): void {
        this.history.keyword = null;
        this.history.pagination.page = 1;
        this.history.pagination.limit = this.gridConfig.rowsPerPageOptions[0];
        this.history.sorting.field = undefined;
        this.history.sorting.direction = undefined;
    }

    private _getActiveFilterView(): IFilterView {
        return this.filterViews.filter(x => x['_active'])[0];
    }
}
