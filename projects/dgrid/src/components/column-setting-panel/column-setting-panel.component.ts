import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridStoreService } from '../../services';
import * as fromModel from '../../models';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { SubSink } from 'subsink';

@Component({
    selector: 'dgrid-column-setting-panel',
    templateUrl: './column-setting-panel.component.html',
    styleUrls: ['./column-setting-panel.component.scss']
})
export class ColumnSettingPanelComponent implements OnInit, OnDestroy {

    public frozenColumns: Array<fromModel.ITableColumn>;
    public unfrozenColumns: Array<fromModel.ITableColumn>;
    public columns: Array<fromModel.ITableColumn>;
    public columnDragging: boolean;
    public keyword: string;
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService,
    ) { }

    public ngOnInit(): void {
        this.subs.sink = this.storeSrv.activeColumns$.subscribe(cols => {
            // console.log('cols', cols);
            const ncols: Array<fromModel.ITableColumn> = [];
            // columns因为要给drag list使用改变属性,所以这里对columns展开,允许修改
            cols.forEach(col => ncols.push({ ...col }));
            this.columns = ncols;
            this.frozenColumns = this.columns.filter(x => x['frozen']);
            this.unfrozenColumns = this.columns?.filter(x => !x['frozen']);
        });
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public drop(event: CdkDragDrop<Array<fromModel.ITableColumn>>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        this.storeSrv.changeColumnOrder(this.frozenColumns.map(c => {
            c.frozen = true;
            return c;
        }).concat(this.unfrozenColumns.map(c=>{
            c.frozen = false;
            return c;
        })));
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
