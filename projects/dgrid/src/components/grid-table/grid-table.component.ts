import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, ElementRef, AfterViewInit, Renderer2, OnDestroy } from '@angular/core';
import * as fromModel from '../../models';
import { MenuItem } from '@byzan/orion2';
import { GridStoreService } from '../../services';
import { SubSink } from 'subsink';
import { BehaviorSubject } from 'rxjs';
import { filter, delay } from 'rxjs/operators';
import * as fromDirective from '../../directives';

@Component({
    selector: 'dgrid-table-1',
    templateUrl: './grid-table.component.html',
    styleUrls: ['./grid-table.component.scss']
})
export class GridTableComponent implements OnInit, OnDestroy {

    @Input()
    public snapline: Element;
    public columns: Array<fromModel.ITableColumn>;
    public datas: Array<any> = [];
    public unFrozenAdvanceColSettingMenu: Array<MenuItem>;
    public frozenAdvanceColSettingMenu: Array<MenuItem>;
    public currentEditColumn: string;
    public sort: fromModel.ISortEvent;
    @ViewChild('unFrozenAdvanceColSettingMenuCt', { static: false })
    private unFrozenAdvanceColSettingMenuCt: any;
    @ViewChild('frozenAdvanceColSettingMenuCt', { static: false })
    private frozenAdvanceColSettingMenuCt: any;
    @ViewChild('table')
    private table: ElementRef;
    @ViewChildren('headerCell')
    private headerCells: QueryList<ElementRef>;
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService,
        private renderer2: Renderer2
    ) { }

    public get frozenColumns(): Array<fromModel.ITableColumn> {
        return this.columns?.filter(x => x['frozen']);
    }

    public get unfrozenColumns(): Array<fromModel.ITableColumn> {
        return this.columns?.filter(x => !x['frozen']);
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.storeSrv.activeColumns$.subscribe(cols => {
            this.columns = cols;
        });

        this.subs.sink = this.storeSrv.datas$.subscribe(datas => {
            this.datas = datas;
        });

        this.subs.sink = this.storeSrv.sort$.subscribe(sort => {
            this.sort = sort;
        });
    }

    public onSort(sort: fromModel.ISortEvent): void {
        this.storeSrv.changeSort(sort);
    }

    public afterColumnResize(): void {
        this.calculateAndStoreColumnWidth();
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
