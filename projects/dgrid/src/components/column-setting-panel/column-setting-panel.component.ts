import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridStoreService } from '../../services';
import * as fromModel from '../../models';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { SubSink } from 'subsink';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'dgrid-column-setting-panel',
    templateUrl: './column-setting-panel.component.html',
    styleUrls: ['./column-setting-panel.component.scss']
})
export class ColumnSettingPanelComponent implements OnInit, OnDestroy {

    public columns: Array<fromModel.ITableColumn>;
    public keyword: string;
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService,
    ) { }

    public ngOnInit(): void {
        this.subs.sink = this.storeSrv.activeColumns$.subscribe(cols => {
            // console.log('cols', cols);
            let ncols = [];
            // columns因为要给drag list使用改变属性,所以这里对columns展开,允许修改
            cols.forEach(col => {
                ncols.push({ ...col });
            });
            this.columns = ncols;
        });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public dropTarget(event: CdkDragDrop<string>): void {
        moveItemInArray(this.columns, event.previousIndex, event.currentIndex);
        // console.log('drag', this.columns);
        this.storeSrv.changeColumnOrder(this.columns.map(x => x.field));
    }

    public toggleColumnVisible(field: string): void {
        this.storeSrv.toggleColumnVisible(field);
    }

    public filterColumn(): void {

    }

    public trackByColumnFn(inde: number, it: { field: string }): string {
        return it.field;
    }

}
