import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridStoreService } from '../../services';
import { SubSink } from 'subsink';
import { first } from 'rxjs/operators';

@Component({
    selector: 'dgrid-footer',
    templateUrl: './grid-footer.component.html',
    styleUrls: ['./grid-footer.component.scss']
})
export class GridFooterComponent implements OnInit, OnDestroy {

    public displayMode: string;
    public rows: number;
    public dataTotal = 0;
    public paginatorFirst = 0;
    public rowsPerPageOptions: Array<number>;
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService,
    ) { }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.storeSrv.rowsPerPageOptions$.pipe(first()).subscribe(options => {
            this.rowsPerPageOptions = options;
            this.rows = this.rowsPerPageOptions[0];
        });
        this.subs.sink = this.storeSrv.dataCount$.subscribe(count => this.dataTotal = count);
        this.subs.sink = this.storeSrv.pagination$.subscribe(p => {
            this.paginatorFirst = (p.page - 1) * p.limit;
        });
    }

    public paginate(evt: { first: number; rows: number; page: number }): void {
        this.paginatorFirst = evt.first;
        // console.log('page change', evt.page + 1, evt.rows);
        this.storeSrv.changePagination(evt.page + 1, evt.rows);
    }

}
