import { Component, OnInit } from '@angular/core';
import { DynamicDialogRef, DynamicDialogService } from '@byzan/orion2';
import { MenuItem, SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { MessageFlowEnum } from '../../enums/message-flow.enum';
import { DStoreOption } from '../../models/i-dstore';
import { IFilterView } from '../../models/i-filter-view';
import { IHistory } from '../../models/i-history';
import { ITableColumn } from '../../models/i-table-column';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridDataService } from '../../services/grid-data.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { dataMap, topicFilter } from '../../utils/grid-tool';
import { ColumnVisualEditingPanelComponent } from '../column-visual-editing-panel/column-visual-editing-panel.component';
import { ITransferItem } from '../transfer/transfer.component';

@Component({
    selector: 'xcloud-grid-header',
    templateUrl: './grid-header.component.html',
    styleUrls: ['./grid-header.component.scss']
})
export class GridHeaderComponent implements OnInit {

    public sortTip: string;
    public filterTip: string;
    public enableFilterView: boolean = false;
    public enableReturn: boolean = false;
    public keyword: string;
    public allViews: Array<SelectItem> = [];
    public activeView: any;
    public advanceSettingMenu: Array<MenuItem>;
    public constructor(
        public dialogService: DynamicDialogService,
        private cache: GridDataService,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService
    ) {

    }

    public ngOnInit(): void {
        // 订阅视图数据信息
        const viewDefinitionObs: Observable<Array<IFilterView>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap);
        const historyObs: Observable<IHistory> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.History), dataMap);
        const optionObs: Observable<DStoreOption> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.DStoreOption), dataMap);

        viewDefinitionObs
            .subscribe(views => {
                let v: IFilterView = views.filter(x => x['_active'])[0];
                this.activeView = v.id;
                this.allViews = views.map(x => ({ value: x.id, label: x.name }));

                // tslint:disable-next-line: prefer-conditional-expression
                if (v.filters?.length) {
                    this.filterTip = `按${v.filters.map(f => v.columns.filter(x => x.field === f.field)[0].name).join('，')} 筛选`;
                } else {
                    this.filterTip = null;
                }
            });

        optionObs
            .pipe(take(1))
            .subscribe(option => {
                this.enableFilterView = option.enableView;
            });

        historyObs.subscribe(h => {
            // console.log('history', h);
            this.keyword = h.keyword;
            if (h.sorting?.field) {
                let v: IFilterView = this.cache.getActiveFilterView();
                this.sortTip = `按${v.columns.filter(x => x.field === h.sorting.field)[0].name} 排序`;
            } else {
                this.sortTip = null;
            }

            // this.sortTip=
        });

        this.advanceSettingMenu = [
            {
                label: '选择需要显示的列',
                command: () => {
                    let columns: Array<ITableColumn> = this.cache.getActiveFilterViewColumns();
                    const ref: DynamicDialogRef<ColumnVisualEditingPanelComponent> = this.dialogService.open(ColumnVisualEditingPanelComponent, {
                        header: '选择需要显示的字段',
                        width: '600px',
                        height: '500px',
                        data: { columns }
                    });
                    ref.afterClosed().pipe(filter(x => x)).subscribe((res: [Array<ITransferItem>, Array<ITransferItem>]) => {
                        let [targets, sources] = res;
                        let nColumns: Array<ITableColumn> = [];
                        sources.forEach(s => {
                            let col: ITableColumn = columns.filter(x => x.field === s.value)[0];
                            col['_invisibale'] = false;
                            nColumns.push(col);
                        });
                        targets.forEach(s => {
                            let col: ITableColumn = columns.filter(x => x.field === s.value)[0];
                            col['_invisibale'] = true;
                            nColumns.push(col);
                        });
                        let view: IFilterView = this.cache.getActiveFilterView();
                        view.columns = nColumns;
                        this.cache.setFilterView(view);
                        this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view });
                    });
                }
            }
        ];

        // setTimeout(() => {
        //     let cols = this.cache.getActiveFilterViewColumns();
        // }, 500);
    }

    public toggleFilterPanel(): void {
        this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel);
    }

    public closeFilterPanel(): void {
        this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel, false);
    }

    public refresh(): void {
        this.closeFilterPanel();
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public search(): void {
        this.cache.initializeHistory();
        this.cache.setKeyword(this.keyword);
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public reset(): void {
        this.closeFilterPanel();
        this.cache.initializeHistory();
        this.messageFlow.publish(MessageFlowEnum.ResetQueryParam);
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public changeActiveView(): void {
        this.cache.initializeHistory();
        this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel, false);
        this.cache.setActiveViewId(this.activeView);
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public checkFilter(): void {
        this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel, true);
    }

}
