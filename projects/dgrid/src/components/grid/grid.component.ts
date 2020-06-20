import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DStore } from '../../models';
import * as fromService from '../../services';
import { GRIDCONFIG, IGridConfig } from '../../tokens';
import * as fromConst from '../../consts';
import { ActivatedRoute } from '@angular/router';
import { SubSink } from 'subsink';


@Component({
    selector: 'dgrid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        fromService.GridStoreService
    ]
})
export class GridComponent implements OnInit, OnDestroy {

    private enableUrlHistory: boolean;
    private subs = new SubSink();
    public constructor(
        @Inject(GRIDCONFIG)
        private config: IGridConfig,
        private dstore: DStore,
        private storeSrv: fromService.GridStoreService,
        private acr: ActivatedRoute
    ) {

        this.dstore.registryGridStartup(option => {
            option = option || {};
            // console.log('option', option);
            this.enableUrlHistory = option.enableUrlHistory;
            this.storeSrv.initGrid(option);
        });
        this.dstore.registryGridRefresh(history => this.storeSrv.refreshGrid(history));
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public async ngOnInit(): Promise<void> {
        // console.log('on init');
        // if (this.enableUrlHistory) {
        //     this.subs.sink = this.acr.queryParams.subscribe(q => {
        //         console.log(1, q);
        //     });
        // }

    }

}
