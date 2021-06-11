import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, HostListener, Injector, NgZone, OnInit } from '@angular/core';
import * as fromModel from '../../models';
import { LazyService } from '../../utils';
import * as faker from "faker";

@Component({
    selector: 'mirror-grid-content',
    templateUrl: './grid-content.component.html',
    styleUrls: ['./grid-content.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridContentComponent implements OnInit {

    @HostBinding('class.disable-user-select')
    public disableUserSelect: boolean;
    public columns: Array<fromModel.ITableColumn>;
    public datas: Array<any>;
    @LazyService(ChangeDetectorRef)
    private readonly cdr: ChangeDetectorRef;
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

    }

    public beforeResizeColumnWidth(): void {
        this.disableUserSelect = true;
    }

    public afterResizeColumnWidth(field, size: number): void {
        this.disableUserSelect = false;
        this.cdr.markForCheck();

        console.log('after resize:', field, size);

    }

    public trackByColumnFn(index: number, it: fromModel.ITableColumn): string {
        return it.field;
    }

    public trackByDataFn(index: number, it: { id: any }): string {
        return it.id;
    }

}
