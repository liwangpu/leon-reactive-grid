import { Component, OnInit, Inject } from '@angular/core';
import { DStore } from '../../models';
import { GridStoreService } from '../../services';
import { GRIDCONFIG, IGridConfig } from '../../tokens';
import * as fromConst from '../../consts';

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

        // this.storeSrv.changePagination(1, this.config.rowsPerPageOptions[0]);
    }

    public async ngOnInit(): Promise<void> {
        let cols = await this.dstore.getColumns();
        let views = await this.dstore.getFilterViews();
        // 如果view为空,用column生成一个默认的view
        if (!views.length) {
            views.push({ id: fromConst.DEFAULT_VIEW_ID, name: fromConst.DEFAULT_VIEW_NAME, columns: cols });
        }
        this.storeSrv.initViews(views);
        console.log(1, views);

    }

}
