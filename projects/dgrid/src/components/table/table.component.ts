import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, Renderer2, OnDestroy } from '@angular/core';
import * as fromModel from '../../models';
import { MenuItem } from '@byzan/orion2';
import { GridStoreService } from '../../services';
import { SubSink } from 'subsink';
import { BehaviorSubject } from 'rxjs';
import { filter, delay } from 'rxjs/operators';
import * as fromDirective from '../../directives';

@Component({
    selector: 'dgrid-table',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, AfterViewInit, OnDestroy {

    @Input()
    public snapline: Element;
    @Input()
    public set columns(val: Array<fromModel.ITableColumn>) {
        this._columns = val;
        this.columnChange$.next(val);
    }
    @Input()
    public selectMode: 'single' | 'multiple' = 'multiple';
    @Input()
    public datas: Array<any> = [];
    public currentEditColumn: string;
    public unFrozenAdvanceColSettingMenu: Array<MenuItem>;
    public frozenAdvanceColSettingMenu: Array<MenuItem>;
    public sort: fromModel.ISortEvent;
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
    private _columns: Array<fromModel.ITableColumn>;
    private columnChange$ = new BehaviorSubject<Array<fromModel.ITableColumn>>(null);
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService,
        private renderer2: Renderer2
    ) { }

    public get columns(): Array<fromModel.ITableColumn> {
        return this._columns;
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

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
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
        this.subs.sink = this.columnChange$.pipe(filter(x => x?.length > 0), delay(100)).subscribe(cols => {
            let visibleColCount = cols.filter(x => !x.hidden).length;
            this.renderer2.setStyle(this.tableCt.nativeElement, 'min-width', `${visibleColCount * 100}px`);
            this.calculateStickyPosition();
        });
        this.subs.sink = this.storeSrv.sort$.subscribe(sort => {
            this.sort = sort;
        });
    }

    public ngAfterViewInit(): void {
        // this.calculateStickyPosition();
    }

    public onSort(sort: fromModel.ISortEvent): void {
        this.storeSrv.changeSort(sort);
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

    public trackByDataFn(it: { id: any }): string {
        return it.id;
    }

    public trackByColumnFn(it: { field: string }): string {
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
