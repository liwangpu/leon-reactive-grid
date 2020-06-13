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

        this.dstore.registryGridStartup(async (o, h) => {
            let cols = await this.dstore.getColumns();
            let views = await this.dstore.getFilterViews();
            let result = await this.dstore.onQuery({});
            // 如果view为空,用column生成一个默认的view
            if (!views.length) {
                views.push({ id: fromConst.DEFAULT_VIEW_ID, name: fromConst.DEFAULT_VIEW_NAME, columns: cols });
            }
            this.storeSrv.initViews(views);
            this.storeSrv.changeActiveView(h?.viewId || views[0].id);
            this.storeSrv.setDatas(result.items);
            // console.log(1, result);
        });
        this.storeSrv.changePagination(1, this.config.rowsPerPageOptions[0]);
    }

    public async ngOnInit(): Promise<void> {


    }

}
