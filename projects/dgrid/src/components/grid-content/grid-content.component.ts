import { ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Component, HostBinding, QueryList, ViewChildren, HostListener, Injector, NgZone, OnInit } from '@angular/core';
import * as fromModel from '../../models';
import { LazyService } from '../../utils';
import * as faker from "faker";
import { TableHeadTdDirective } from '../../directives/public-api';

@Component({
    selector: 'mirror-grid-content',
    templateUrl: './grid-content.component.html',
    styleUrls: ['./grid-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridContentComponent implements OnInit {

    @HostBinding('class.disable-user-select')
    public disableUserSelect: boolean;
    public tableWidth: number;
    public columns: Array<fromModel.ITableColumn>;
    public datas: Array<any>;
    @ViewChildren(TableHeadTdDirective)
    public tableHeadThs: QueryList<TableHeadTdDirective>;
    @LazyService(ChangeDetectorRef)
    private readonly cdr: ChangeDetectorRef;
    @LazyService(ElementRef)
    private readonly el: ElementRef;
    @LazyService(NgZone)
    private readonly zone: NgZone;
    public constructor(
        protected injector: Injector
    ) {
        this.columns = [
            {
                field: 'name',
                name: '名称'
            },
            {
                field: 'age',
                name: '年纪'
            },
            {
                field: 'info',
                name: '备注'
            }
        ];
        this.datas = [];
        for (let i = 0; i < 10; i++) {
            this.datas.push({ id: faker.datatype.uuid(), name: faker.name.findName(), age: faker.datatype.number({ min: 5, max: 20 }), info: faker.lorem.words(20) });
        }
    }

    public ngOnInit(): void {
        this.refreshTableWidth(true);
        // console.log('rect:', contentRect, colTotalWidth);
    }

    public beforeResizeColumnWidth(): void {
        this.disableUserSelect = true;
    }

    public afterResizeColumnWidth(field, size: number): void {
        this.disableUserSelect = false;

        // const col = this.columns.find(c => c.field === field);
        // col.width = size;
        const ths = this.tableHeadThs.toArray();
        this.columns.forEach(c => {
            if (c.field === field) {
                c.width = size;
            } else {
                let th = ths.find(t => t.field === c.field);
                const rect: DOMRect = th.el.nativeElement.getBoundingClientRect();
                c.width = rect.width;
            }
        });

        this.refreshTableWidth();
        // console.log(1, this.tableHeadThs.length);

        this.cdr.markForCheck();
        // console.log('after resize:', field, size);
    }

    public trackByColumnFn(index: number, it: fromModel.ITableColumn): string {
        return it.field;
    }

    public trackByDataFn(index: number, it: { id: any }): string {
        return it.id;
    }

    private refreshTableWidth(init?: boolean): void {
        const contentRect: DOMRect = this.el.nativeElement.getBoundingClientRect();


        const widths = this.columns.map(c => c.width ? c.width : 100);
        const colTotalWidth: number = widths.reduce((a, b) => a + b, 0);
        this.tableWidth = colTotalWidth > contentRect.width ? colTotalWidth : contentRect.width;
        this.cdr.markForCheck();
    }

}
