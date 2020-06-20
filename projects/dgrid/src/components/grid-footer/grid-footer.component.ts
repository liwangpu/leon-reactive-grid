import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import * as fromToken from '../../tokens';
import { GridStoreService } from '../../services';
import { SubSink } from 'subsink';

@Component({
    selector: 'dgrid-footer',
    templateUrl: './grid-footer.component.html',
    styleUrls: ['./grid-footer.component.scss']
})
export class GridFooterComponent implements OnInit, OnDestroy {

    public displayMode: string;
    public rows: number;
    public dataTotal: number = 0;
    public paginatorFirst: number = 0;
    public rowsPerPageOptions: Array<number>;
    private subs = new SubSink();
    public constructor(
        @Inject(fromToken.GRIDCONFIG) private gridConfig: fromToken.IGridConfig,
        private storeSrv: GridStoreService,
    ) {
        this.rowsPerPageOptions = this.gridConfig.rowsPerPageOptions;
        this.rows = this.rowsPerPageOptions[0];
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.storeSrv.dataCount$.subscribe(count => this.dataTotal = count);
        this.subs.sink = this.storeSrv.pagination$.subscribe(p => {
            // console.log('pagination', p);
            this.paginatorFirst = (p.page - 1) * p.limit;
        });
    }

    public paginate(evt: { first: number; rows: number; page: number }): void {
        this.paginatorFirst = evt.first;
        // console.log('page change', evt.page + 1, evt.rows);
        this.storeSrv.changePagination(evt.page + 1, evt.rows);
    }

}
