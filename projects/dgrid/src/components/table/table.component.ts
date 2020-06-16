import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, Renderer2, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import * as fromModel from '../../models';
import { MenuItem } from '@byzan/orion2';
import { GridStoreService } from '../../services';
import { SubSink } from 'subsink';

@Component({
    selector: 'dgrid-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {

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
    @ViewChild('tableCt', { static: false })
    private tableCt: ElementRef;
    private advanceSettingPanel: string;
    private reOpenAdvanceSettingPanel: string;
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService,
        private renderer2: Renderer2
    ) { }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnChanges(changes: SimpleChanges): void {

        // column赋值时候计算一次列宽
        if (changes['columns']?.currentValue?.length) {
            let cols: Array<fromModel.ITableColumn> = changes['columns']?.currentValue;
            if (!cols.every(x => x.width)) {
                setTimeout(() => {
                    this.calculateAndStoreColumnWidth();
                }, 800);
            }

            if (cols.every(x => x.hidden) && this.tableCt) {
                this.renderer2.setStyle(this.tableCt.nativeElement, 'width', '0');
            }
        }
    }

    public ngOnInit(): void {
        this.unFrozenAdvanceColSettingMenu = [
            {
                id: 'freezen-column',
                label: '冻结此列',
                command: () => {
                    this.unFrozenAdvanceColSettingMenuCt.hide();
                    this.storeSrv.freezenColumn(this.currentEditColumn);
                    this.calculateStickyPosition();
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
                }
            }
        ];
        this.subs.sink = this.storeSrv.advanceSettingPanel$.subscribe(panel => this.advanceSettingPanel = panel);
    }

    public ngAfterViewInit(): void {
        // this.calculateStickyPosition();
    }

    public get frozenColumns(): Array<fromModel.ITableColumn> {
        // let cols = this.columns?.filter(x => x['frozen'] && !x['hidden'] && x.field !== this.currentEditColumn);
        // if (this.currentEditColumn && this.columns.some(x => x.field === this.currentEditColumn && x['frozen'])) {
        //     cols.push(this.columns.filter(x => x.field === this.currentEditColumn)[0]);
        // }
        // return cols;
        return this.columns?.filter(x => x['frozen'] && !x['hidden']);
    }

    public get unfrozenColumns(): Array<fromModel.ITableColumn> {
        return this.columns?.filter(x => !x['frozen'] && !x['hidden']);
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
        if (this.advanceSettingPanel) {
            this.reOpenAdvanceSettingPanel = this.advanceSettingPanel;
            this.storeSrv.changeAdvanceSettingPanel();
        }
    }

    public afterColumnResize(): void {
        this.calculateStickyPosition();
        this.calculateAndStoreColumnWidth();
        if (this.reOpenAdvanceSettingPanel) {
            this.storeSrv.changeAdvanceSettingPanel(this.reOpenAdvanceSettingPanel);
            this.reOpenAdvanceSettingPanel = null;
        }
    }

    public trackByDataFn(index: number, it: { id: any }): string {
        return it.id;
    }

    public trackByColumnFn(inde: number, it: { field: string }): string {
        return it.field;
    }

    private calculateAndStoreColumnWidth(): void {
        let obj: any = {};
        this.headerCells.forEach(it => {
            const rect: any = it.nativeElement.getBoundingClientRect();
            let field = it.nativeElement.getAttribute('field-name');
            obj[field] = rect.width;
        });
        this.storeSrv.changeColumnWidth(obj);
    }

}
