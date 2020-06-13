import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';
import * as fromModel from '../../models';
import { MenuItem } from '@byzan/orion2';
import { GridStoreService } from '../../services';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'dgrid-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit {

    @Input()
    public snapline: Element;
    @Input()
    public columns: Array<fromModel.ITableColumn> = [];
    @Input()
    public selectMode: 'single' | 'multiple' = 'multiple';
    @Input()
    public datas: Array<any> = [];
    public currentEditColumn: string;
    public unFrozenAdvanceColSettingMenu: Array<MenuItem>;
    public frozenAdvanceColSettingMenu: Array<MenuItem>;
    @ViewChild('unFrozenAdvanceColSettingMenuCt', { static: false })
    private unFrozenAdvanceColSettingMenuCt: any;
    @ViewChild('frozenAdvanceColSettingMenuCt', { static: false })
    private frozenAdvanceColSettingMenuCt: any;
    @ViewChildren('frozenCell')
    private frozenCells: QueryList<ElementRef>;
    @ViewChildren('headerCell')
    private headerCells: QueryList<ElementRef>;
    @ViewChildren('dataRow')
    private dataRows: QueryList<ElementRef>;
    public constructor(
        private storeSrv: GridStoreService,
        private renderer2: Renderer2
    ) { }

    public ngOnInit(): void {
        this.unFrozenAdvanceColSettingMenu = [
            {
                id: 'freezen-column',
                label: '冻结此列',
                command: () => {
                    this.unFrozenAdvanceColSettingMenuCt.hide();
                    this.storeSrv.freezenColumn(this.currentEditColumn);
                    this.calculateStickyPosition();
                    // this.cache.freezeColumn(this.currentEditColumn);
                    // this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view: this.cache.getActiveFilterView(), fetchData: false });
                }
            }
        ];

        this.frozenAdvanceColSettingMenu = [
            {
                id: 'unfreezen-column',
                label: '取消冻结',
                command: () => {
                    this.frozenAdvanceColSettingMenuCt.hide();
                    this.storeSrv.unFreezenColumn(this.currentEditColumn);
                    this.calculateStickyPosition();
                    // if (this.columns.length > 1) {
                    //     // 取消冻结需要减去该列的宽度,不然冻结表格不会取消占位该列占位宽度
                    //     let tableWidth: number = 0;
                    //     let thWdith: number = 0;
                    //     let tableRect: DOMRect = this.table.nativeElement.getBoundingClientRect();
                    //     tableWidth = tableRect.width;
                    //     let thRect: DOMRect = this.currentTableCell.getBoundingClientRect();
                    //     thWdith = thRect.width;
                    //     this.renderer2.setStyle(this.table.nativeElement, 'width', `${tableWidth - thWdith}px`);
                    // } else {
                    //     this.renderer2.setStyle(this.table.nativeElement, 'width', `auto`);
                    // }
                    // this.cache.unfreezenColumn(this.currentEditColumn);
                    // this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view: this.cache.getActiveFilterView(), fetchData: false });
                }
            }
        ];
    }

    public ngAfterViewInit(): void {
        // this.calculateStickyPosition();
    }

    public get frozenColumns(): Array<fromModel.ITableColumn> {
        return this.columns?.filter(x => x['@frozen'] && !x['@invisibale']);
    }

    public get unfrozenColumns(): Array<fromModel.ITableColumn> {
        return this.columns?.filter(x => !x['@frozen'] && !x['@invisibale']);
    }

    public calculateStickyPosition(): void {
        // 延时计算,给dom渲染留时间
        setTimeout(() => {
            let cells = [];
            this.frozenCells?.forEach((col, index) => {
                const rect: DOMRect = col.nativeElement.getBoundingClientRect();
                cells.push(rect.width);
                let left = cells[index - 1] ? `${cells[index - 1]}px` : '0';
                this.renderer2.setStyle(col.nativeElement, 'left', left);
            });

            this.dataRows?.forEach(row => {
                let nodes = row.nativeElement.childNodes;
                let index = 0;
                nodes.forEach(n => {
                    if (n.className?.indexOf('frozen') > -1) {
                        let left = cells[index - 1] ? `${cells[index - 1]}px` : '0';
                        this.renderer2.setStyle(n, 'left', left);
                        index++;
                    }
                });
            });
        }, 25);
    }

    public beforeColumnResize(): void {

    }

    public afterColumnResize(): void {
        this.calculateStickyPosition();

        let obj: any = {};
        this.headerCells.forEach(it => {
            const rect: any = it.nativeElement.getBoundingClientRect();
            let field = it.nativeElement.getAttribute('field-name');
            obj[field] = rect.width;
        });
        this.storeSrv.changeColumnWidth(obj);
    }

    public trackByDataFn(index: number, it: { id: any }): string {
        return it.id;
    }

    public trackByColumnFn(inde: number, it: { field: string }): string {
        return it.field;
    }

}
