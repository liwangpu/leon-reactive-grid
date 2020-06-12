import { Component, OnInit, Inject } from '@angular/core';
import { DStore } from '../../models';
import { GridStoreService } from '../../services';
import { GRIDCONFIG, IGridConfig } from '../../tokens';

@Component({
    selector: 'dgrid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        GridStoreService
    ]
})
export class GridComponent implements OnInit {

    public constructor(
        @Inject(GRIDCONFIG)
        private config: IGridConfig,
        private dstore: DStore,
        private storeSrv: GridStoreService
    ) {

        this.storeSrv.changePagination(1, this.config.rowsPerPageOptions[0]);
    }

    public ngOnInit(): void {
    }

}
