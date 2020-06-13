import { Component, OnInit, OnDestroy } from '@angular/core';
import * as fromModel from '../../models';
import { GridStoreService } from '../../services';
import { SubSink } from 'subsink';

@Component({
    selector: 'dgrid-content',
    templateUrl: './grid-content.component.html',
    styleUrls: ['./grid-content.component.scss']
})
export class GridContentComponent implements OnInit, OnDestroy {

    public showFilterView: boolean = false;
    public activeRowIndex: number = -1;
    public columns: Array<fromModel.ITableColumn>;
    public datas: Array<any>;
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService
    ) { }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.storeSrv.activeColumns$.subscribe(cols => {
            console.log('cols', cols);
            this.columns = cols;
        });

        this.subs.sink = this.storeSrv.datas$.subscribe(datas => {
            // console.log('datas', datas);
            this.datas = datas;
        });
    }

}
