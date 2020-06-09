import { Component, Inject, inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { DialogService } from 'primeng/dynamicdialog';
import { combineLatest, from, Observable, Subject } from 'rxjs';
import { auditTime, map, take, takeUntil, tap } from 'rxjs/operators';
import { ColumnTypeEnum } from '../../enums/column-type-enum.enum';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { MessageFlowEnum } from '../../enums/message-flow.enum';
import { DStore } from '../../models/dstore';
import { IFilterView } from '../../models/i-filter-view';
import { IHistory } from '../../models/i-history';
import { IQueryResult } from '../../models/i-query-result';
import { ITableColumn } from '../../models/i-table-column';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridDataService } from '../../services/grid-data.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { GRIDCONFIG, IGridConfig } from '../../tokens/grid-config';
import { IQueryParamTransformPolicy, QUERYPARAMTRANSFORMPOLICY } from '../../tokens/query-param-transform-policy';
import { ArrayTool } from '../../utils/array-tool';
import { ExpressionTranslater } from '../../utils/expression-translater';
import { dataMap, topicFilter, tupleMap } from '../../utils/grid-tool';
import { ObjectTool } from '../../utils/object-tool';

@Component({
    selector: 'xcloud-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        DialogService,
        GridDataService,
        GridDataFlowService,
        GridMessageFlowService
    ]
})
export class GridComponent implements OnInit, OnDestroy {

    public displayMode: string;
    public noPagination: boolean = false;
    private columns: Array<ITableColumn>;
    private nestedDataLevel: number = 0;
    private nestedToggleField: string;
    private latestFilterViews: [Array<IFilterView>] = [null];
    private destroy$: Subject<boolean> = new Subject<boolean>();
    public constructor(
        @Optional() @Inject(QUERYPARAMTRANSFORMPOLICY)
        private queryParamTransformPolicy: IQueryParamTransformPolicy,
        @Inject(GRIDCONFIG)
        private gridConfig: IGridConfig,
        private dstore: DStore,
        private cache: GridDataService,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService,
        public mediaObserver: MediaObserver
    ) {
        this.dstore.registryGridStartup(option => {
            // console.log('option', option);
            if (typeof option.enableView === 'undefined') {
                option.enableView = true;
            }

            if (typeof option.enableColumnFrozen === 'undefined') {
                option.enableColumnFrozen = true;
            }

            if (option.noPagination) {
                this.cache.setPagination(1, 999999);
            } else {
                let h: IHistory = this.cache.getHistory();
                if (!h.pagination?.page) {
                    this.cache.setPagination(1, this.gridConfig.rowsPerPageOptions[0]);
                }
            }

            this.noPagination = option.noPagination;
            this.nestedDataLevel = option.showNestedDataLevel;
            this.nestedToggleField = option.nestedToggleColumn;

            // console.log('option', option);
            this.dataFlow.publish(DataFlowTopicEnum.DStoreOption, option);
            this.messageFlow.publish(MessageFlowEnum.DynamicTableButtons, this.dstore.dynamicTableButtons);
            this.messageFlow.publish(MessageFlowEnum.TableButtons, this.dstore.tableButtons);
            // 异步请求column,view
            from(this.dstore.getColumns()).subscribe(columns => {
                this.columns = columns;
                this.dataFlow.publish(DataFlowTopicEnum._ColumnDefinition, columns);
            });
            from(this.dstore.getFilterViews()).subscribe(views => this.dataFlow.publish(DataFlowTopicEnum._ViewDefinition, views));
            //
            // this.dataFlow.publish(DataFlowTopicEnum._History, option.otherQueryParams || {});
            this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
        });

        // tslint:disable-next-line: deprecation
        mediaObserver.media$
            .pipe(takeUntil(this.destroy$))
            .pipe(map(m => m.mqAlias === 'xs' ? 'mobile' : 'browser'))
            .subscribe(mode => this.displayMode = mode);
        // log整个表格通讯信息
        // this.dataFlow.message.subscribe(ms => console.log('dt message:', ms));
        // this.messageFlow.message.subscribe(ms => console.log('ms message:', ms));
    }

    public ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
        this.destroy$.unsubscribe();
    }

    public refreshQuery(history?: { view?: string; keyword?: string; page?: number; limit?: number; field?: string; direction?: string }): void {
        // console.log('refresh', history);
        if (history) {
            this.cache.setActiveViewId(history.view);

            // if (history.keyword) {
            this.cache.setKeyword(history.keyword);
            // }

            // if (history.page) {
            this.cache.setPagination(history.page, history.limit);
            // }

            // if (history.field) {
            this.cache.setSorting(history.field, history.direction);
            // }
        }

        // console.log(1, this.cache.getHistory());

        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public setOtherQueryParam(otherQueryParams: { [key: string]: any }): void {
        this.dataFlow.publish(DataFlowTopicEnum._History, otherQueryParams || {});
    }

    public async ngOnInit(): Promise<void> {
        let columnFormat: Map<string, string> = new Map<string, string>();
        const _colDefinitionfObs: Observable<Array<ITableColumn>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum._ColumnDefinition), dataMap, take(1))
            .pipe(tap((cols: Array<ITableColumn>) => {
                if (cols.some(c => c.fieldType === ColumnTypeEnum.Format)) {
                    cols.filter(c => c.fieldType === ColumnTypeEnum.Format).forEach(c => {
                        columnFormat.set(c.field, c.format);
                    });
                }
            }));
        const _viewDefinitionObs: Observable<[Array<IFilterView>]> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum._ViewDefinition), dataMap)
            .pipe(tupleMap(this.latestFilterViews));
        const viewDefinitionObs: Observable<Array<IFilterView>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap);
        const _historyObs: Observable<any> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum._History), dataMap);
        const historyObs: Observable<IHistory> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.History), dataMap);
        const dataSelectedObs: Observable<Array<any>> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.RowSelected), dataMap);
        const fiterViewChangeObs: Observable<{ view: IFilterView; fetchData?: boolean }> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.FilterViewChange), dataMap);
        const linkFieldClickObs: Observable<{ field: string; data: any }> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.LinkFieldClick), dataMap);
        const tableButtonClickObs: Observable<{ data: any; key: string; button?: any; buttonType: 'static' | 'dynamic' }> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.OperationButtonClick), dataMap);
        const resetQueryParamObs: Observable<any> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.ResetQueryParam));

        // tslint:disable-next-line: deprecation
        combineLatest(_colDefinitionfObs, _viewDefinitionObs, _historyObs)
            .pipe(auditTime(200))
            .subscribe((resArr: [Array<ITableColumn>, [Array<IFilterView>], IHistory]) => {
                const [cols, [views]] = resArr;
                const history: IHistory = this.cache.getHistory();
                // console.log('views', history);
                // 1.默认视图可能是没有columns定义的,如果没有,需要把资源的columns赋值上去
                // 2.清除view active定义
                // 首先添加默认"全部"视图
                if (!views.some(x => x.id === '_ALL')) {
                    views.unshift({ id: '_ALL', name: '最近使用视图', columns: cols });
                }

                for (let idx: number = views.length - 1; idx >= 0; idx--) {
                    let view: IFilterView = views[idx];
                    view['_active'] = false;
                }
                let viewIndex: number = history.viewId ? views.findIndex(x => x.id === history.viewId) : 0;
                if (viewIndex < 0) {
                    viewIndex = 0;
                    history.viewId = undefined;
                }

                views[viewIndex]['_active'] = true;
                history.filterLogic = views[viewIndex].filterLogic;
                history.filters = views[viewIndex].filters;
                // this.dataFlow.publish(DataFlowTopicEnum.ColumnDefinition, views[viewIndex].columns);
                this.dataFlow.publish(DataFlowTopicEnum.ViewDefinition, views);
                this.messageFlow.publish(MessageFlowEnum.History, history);
            });

        viewDefinitionObs.subscribe(views => this.latestFilterViews[0] = views);

        resetQueryParamObs
            .subscribe(() => this.dstore.onQueryReset());

        dataSelectedObs
            .subscribe(datas => this.dstore.onDataSelected(datas));

        tableButtonClickObs
            .subscribe(async res => {
                if (this.dstore.onTableButtonClick) {
                    await this.dstore.onTableButtonClick(res.data, res.key, res.button, res.buttonType);
                }
            });

        historyObs
            .subscribe(async history => {
                if (history.viewId === '_ALL') { delete history.viewId; }
                if (history.pagination && !history.pagination.page && !history.pagination.limit) { delete history.pagination; }
                if (!history.keyword) { delete history.keyword; }
                if (history.sorting && !history.sorting.field) { delete history.sorting; }

                if (!this.queryParamTransformPolicy) {
                    console.warn(`当前表格没有注入query param transform policy,所以查询参数不会进行转换`);
                }
                // console.log(12, history);
                let q: any = this.queryParamTransformPolicy?.transform(history) || {};
                let res: IQueryResult = await this.dstore.onQuery(q);
                if (res.items && res.items.length) {
                    if (columnFormat.size) {
                        res.items.forEach(it => {
                            columnFormat.forEach((format: string, field: string) => {
                                it[field] = ExpressionTranslater.translateStringExpression(v => ObjectTool.recursionValueByField(it, v), format);
                            });
                        });
                    }

                    res.items = GridComponent.flattenArray(res.items, 'children', 'id', this.nestedDataLevel);
                    this.recursionValueField(res.items);
                }

                // console.log('res', res);

                this.dataFlow.publish(DataFlowTopicEnum.ListData, res);
            });

        fiterViewChangeObs
            .subscribe(async (obj: { view: IFilterView; fetchData?: boolean; noSave?: boolean }) => {
                let views: Array<IFilterView> = this.cache.getFilterViews();
                ArrayTool.remove(views, v => !v.id);
                let { view, fetchData, noSave } = obj;

                if (!noSave) {
                    if (view.id !== '_ALL') {
                        if (view.id) {
                            await this.dstore.onFilterViewUpdate(view);
                        } else {
                            view = await this.dstore.onFilterViewCreate(view);
                            for (let idx: number = views.length - 1; idx >= 0; idx--) {
                                let v: IFilterView = views[idx];
                                v['_active'] = false;
                            }
                            view['_active'] = true;
                            views.push(view);
                            this.cache.setActiveViewId(view.id);
                            fetchData = true;
                        }
                    } else {
                        let index: number = views.findIndex(x => x.id === view.id);
                        views[index] = view;
                    }
                }

                if (fetchData) {
                    this.dataFlow.publish(DataFlowTopicEnum._ViewDefinition, views);
                } else {
                    this.dataFlow.publish(DataFlowTopicEnum.ViewDefinition, views);
                }
            });

        linkFieldClickObs
            .subscribe(res => this.dstore.onLinkFieldClick(res.field, res.data));
    }

    private recursionValueField(items: Array<any>): void {
        for (let idx: number = items.length - 1; idx >= 0; idx--) {
            let item: any = items[idx];
            for (let col of this.columns) {
                if (col.field.indexOf('.') > -1) {
                    item[col.field] = ObjectTool.recursionValueByField(item, col.field);
                }
            }
        }
    }

    private static flatten(obj: any, nestedProperty: string, parentProperty: string, destArr: Array<any>, level?: number): void {
        if (!obj || !nestedProperty || !destArr) { return; }
        obj['_level'] = obj['@parent'] ? ((obj['@parent']['_level'] as number) + 1) : 1;
        destArr.push(obj);
        if (obj['_level'] < level && obj[nestedProperty] && obj[nestedProperty].length) {
            for (let child of obj[nestedProperty]) {
                if (child) {
                    child['_parent'] = obj[parentProperty];
                    child['_level'] = (obj['_level'] as number) + 1;
                    child['@parent'] = obj;
                    GridComponent.flatten(child, nestedProperty, parentProperty, destArr, level);
                }
            }
            obj['_hasChildren'] = true;
        }
        // tslint:disable-next-line: no-dynamic-delete
        delete obj[nestedProperty];
    }

    private static flattenArray(arr: Array<any>, nestedProperty: string, parentProperty: string, level?: number): Array<any> {
        if (!level) { return arr; }
        let destArr: Array<any> = [];
        for (let it of arr) {
            GridComponent.flatten(it, nestedProperty, parentProperty, destArr, level);
        }
        for (let it of destArr) {
            it['_hidden'] = it['_level'] > 1;
            delete it['@parent'];
        }
        return destArr;
    }

}
