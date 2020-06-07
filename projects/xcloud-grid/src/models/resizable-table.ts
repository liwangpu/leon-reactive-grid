import { ElementRef, EventEmitter, Input, OnInit, Output, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { delay, take } from 'rxjs/operators';
import { SortTableColumnDirective } from '../directives/sort-table-column.directive';
import { DataFlowTopicEnum } from '../enums/data-flow-topic.enum';
import { MessageFlowEnum } from '../enums/message-flow.enum';
import { GridDataFlowService } from '../services/grid-data-flow.service';
import { GridDataService } from '../services/grid-data.service';
import { GridMessageFlowService } from '../services/grid-message-flow.service';
import { ArrayTool } from '../utils/array-tool';
import { dataMap, topicFilter } from '../utils/grid-tool';
import { DStoreOption } from './i-dstore';
import { IFilterView } from './i-filter-view';
import { IHistory } from './i-history';
import { ISortEvent } from './i-sort-event';
import { ITableColumn } from './i-table-column';
import { Table } from './table';

export abstract class ResizableTable extends Table implements OnInit {

    @Output()
    public readonly afterResize: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    public readonly radioSelectChange: EventEmitter<string> = new EventEmitter<string>();
    @Input()
    public snapline: Element;
    @ViewChildren(SortTableColumnDirective)
    public sortColumns: QueryList<SortTableColumnDirective>;
    @ViewChildren('headerCell')
    public headerCells: QueryList<ElementRef>;
    public nestedDataLevel: number = 0;
    public nestedToggleField: string;
    public shownNestedData: boolean = false;
    public allRowSelected: boolean = false;
    public advanceColSettingMenu: Array<MenuItem>;
    @ViewChild('advanceButtonMenuCt', { static: false })
    protected advanceButtonMenuCt: any;
    protected abstract tableType: 'frozen' | 'unfrozen';
    private reOpenFilterPanel: boolean = false;
    public constructor(
        protected renderer2: Renderer2,
        protected cache: GridDataService,
        protected dataFlow: GridDataFlowService,
        protected messageFlow: GridMessageFlowService
    ) {
        super(messageFlow);
    }
    public ngOnInit(): void {
        super.ngOnInit();

        const viewDefinitionObs: Observable<Array<IFilterView>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap);
        const historyObs: Observable<IHistory> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.History), dataMap);
        const optionObs: Observable<DStoreOption> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.DStoreOption), dataMap);

        viewDefinitionObs
            .subscribe(views => {
                let view: IFilterView = views.filter(x => x['_active'])[0];
                let cols: Array<ITableColumn> = view.columns.filter(x => !x['_invisibale']
                    && (this.tableType === 'unfrozen' ? !x['_frozen'] : x['_frozen']));
                let minWidth: number = 0;
                for (let col of cols) {
                    minWidth += col.width ? col.width : 0;
                }

                // if (this.nestedDataLevel > 1) {
                //     if (this.tableType === 'unfrozen') {
                //         this.shownNestedData = !cols.some(x => x['_frozen']);
                //     } else if (this.tableType === 'frozen') {
                //         this.shownNestedData = cols.some(x => x['_frozen']);
                //     } else {
                //         //
                //     }
                // }

                if (minWidth > 0) {
                    this.renderer2.setStyle(this.table.nativeElement, 'width', `${minWidth}px`);
                } else {
                    this.renderer2.removeStyle(this.table.nativeElement, 'width');
                }
            });

        historyObs
            .pipe(delay(100))
            .subscribe(h => {
                if (!h.sorting || !h.sorting.field) {
                    this.clearSort();
                }

                if (h.sorting?.field) {
                    this.sortColumns.forEach(it => {
                        if (it.columnField === h.sorting.field) {
                            it.markDirection(h.sorting.direction);
                        }
                    });
                }
            });

        optionObs
            .pipe(take(1))
            .subscribe(option => {
                if (!option.enableColumnFrozen) {
                    ArrayTool.remove(this.advanceColSettingMenu, it => it.id === 'freezen-column' || it.id === 'unfreezen-column');
                }
                this.nestedToggleField = option.nestedToggleColumn;
                this.shownNestedData = option.showNestedDataLevel > 0;
            });
    }

    public onLinkFieldClick(field: string, data: any, link?: any): void {
        if (!link) { return; }
        this.messageFlow.publish(MessageFlowEnum.LinkFieldClick, { field, data });
    }

    public beforeColumnResize(): void {
        this.reOpenFilterPanel = this.cache.getFilterPanelState();
        if (this.reOpenFilterPanel) {
            this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel);
        }
    }

    public afterColumnResize(): void {
        this.afterResize.next();
        this.messageFlow.publish(MessageFlowEnum.ColumnWidthChange);
        if (this.reOpenFilterPanel) {
            this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel);
        }
    }

    public calculateColumnWidth(): { [key: string]: number } {
        let obj: any = {};
        let index: number = 0;
        this.headerCells.forEach(it => {
            const rect: any = it.nativeElement.getBoundingClientRect();
            obj[this.columns[index].field] = rect.width;
            index++;
        });
        return obj;
    }

    public onSort(sort: ISortEvent): void {
        // // 先清除其他排序列
        this.clearSort(sort.field);
        let field: string = null;
        let direction: string = null;
        if (sort.direction) {
            field = sort.field;
            direction = sort.direction;
        }
        this.cache.setSorting(field, direction);
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public toggleNestedData(item: any, e: any): void {
        e.stopPropagation();
        // tslint:disable-next-line: no-redundant-boolean
        const hideNestedData: boolean = item['_hideNestedData'] ? true : false;

        // 递归折叠
        if (hideNestedData) {
            this.collapseReferenceNestedData(item);
        } else {
            // 显示第一级
            this.datas.forEach(it => {
                if (it['_parent'] === item['id']) {
                    it['_hidden'] = false;
                }
            });
        }
        item['_hideNestedData'] = !hideNestedData;
    }

    private collapseReferenceNestedData(item: any): void {
        item['_hideNestedData'] = true;
        let children: Array<any> = this.datas.filter(it => it['_parent'] === item['id']);
        if (!children.length) { return; }

        for (let it of children) {
            it['_hidden'] = true;
            item['_hideNestedData'] = false;
            let subChildren: Array<any> = this.datas.filter(x => x['_parent'] === item['id']);
            if (subChildren.length) {
                subChildren.forEach(x => this.collapseReferenceNestedData(x));
            }
        }
    }

    private clearSort(excludeField?: string): void {
        if (this.sortColumns.length > 0) {
            this.sortColumns.forEach(it => {
                if (!it.columnField) { return; }

                if (!(excludeField && it.columnField === excludeField)) {
                    it.clearSort();
                }
            });
        }
    }
}
