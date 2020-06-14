import { Component, OnInit, Inject } from '@angular/core';
import { DStore } from '../../models';
import * as fromService from '../../services';
import { GRIDCONFIG, IGridConfig } from '../../tokens';
import * as fromConst from '../../consts';


@Component({
    selector: 'dgrid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        fromService.GridStoreService,
        // GridEffectService,
        // {
        //     provide: GridEffect,
        //     useExisting: GridEffectService
        // },
        // {
        //     provide: USER_PROVIDED_EFFECTS,
        //     multi: true,
        //     useExisting:GridEffectService
        // },
    ]
})
export class GridComponent implements OnInit {

    public constructor(
        @Inject(GRIDCONFIG)
        private config: IGridConfig,
        private dstore: DStore,
        private storeSrv: fromService.GridStoreService
    ) {

        this.dstore.registryGridStartup(async (o, h) => {
            // let cols = await this.dstore.getColumns();
            // let views = await this.dstore.getFilterViews();
            // // let result = await this.dstore.onQuery({});
            // // 如果view为空,用column生成一个默认的view
            // if (!views.length) {
            //     views.push({ id: fromConst.DEFAULT_VIEW_ID, name: fromConst.DEFAULT_VIEW_NAME, columns: cols });
            // }
            // this.storeSrv.initViews(views);
            // this.storeSrv.changeActiveView(h?.viewId || views[0].id);
            // // this.storeSrv.setDatas(result.items);
            // this.storeSrv.loadData();
            // console.log(1, result);
            await this.storeSrv.loadView();
            this.storeSrv.changeActiveView();
            this.storeSrv.changePagination(1, this.config.rowsPerPageOptions[0]);
            this.storeSrv.loadData();
        });

        // this.actions$.pipe(tap(res=>{
        //     console.log(111,res);
        // })).subscribe();
    }

    public async ngOnInit(): Promise<void> {


    }

}
