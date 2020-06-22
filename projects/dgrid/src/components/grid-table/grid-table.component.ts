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
    @ViewChild('unFrozenAdvanceColSettingMenuCt', { static: false })
    private unFrozenAdvanceColSettingMenuCt: any;
    @ViewChild('frozenAdvanceColSettingMenuCt', { static: false })
    private frozenAdvanceColSettingMenuCt: any;
    @ViewChild('table')
    private table: ElementRef;
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService,
        private renderer2: Renderer2
    ) { }

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
                }
            }
        ];
        this.subs.sink = this.storeSrv.activeColumns$.subscribe(cols => {
            this.columns = cols;
        });

        this.subs.sink = this.storeSrv.datas$.subscribe(datas => {
            this.datas = datas;
        });
    }

    public openAdvanceMenu(type: string, event: any): void {
        console.log(1, type);
        if (type === 'unfrozen') {
            this.unFrozenAdvanceColSettingMenuCt.toggle(event);
        }else{
            this.frozenAdvanceColSettingMenuCt.toggle(event);
        }
    }

    public trackByDataFn(it: { id: any }): string {
        return it.id;
    }

    public trackByColumnFn(it: { field: string }): string {
        return it.field;
    }

}
