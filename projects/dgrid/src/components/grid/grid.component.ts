import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { DStore } from '../../models';
import * as fromService from '../../services';
import * as fromConst from '../../consts';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import { skip } from 'rxjs/operators';
import * as fromUtils from '../../utils';


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
    private initialized: boolean = false;
    private subs = new SubSink();
    public constructor(
        private dstore: DStore,
        private storeSrv: fromService.GridStoreService,
        private acr: ActivatedRoute,
        private router: Router
    ) {

        this.dstore.registryGridStartup((option = { rowsPerPageOptions: [25, 50, 100] }) => {
            if (this.initialized) {
                console.warn('dgrid已经初始化,多余的startup将不生效');
                return;
            }
            this.initialized = true;
            let queryParams = {};
            this.enableUrlHistory = option.enableUrlHistory;
            if (this.enableUrlHistory) {
                queryParams = fromUtils.parseUrlQueryParams(this.router.url);
            }
            this.storeSrv.initGrid(option, queryParams);
        });
        this.dstore.registryGridRefresh(queryParams => this.storeSrv.refreshGrid(queryParams));
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public async ngOnInit(): Promise<void> {
        if (this.enableUrlHistory) {
            this.subs.sink = this.acr.queryParams.pipe(skip(1)).subscribe(queryParams => {
                // console.log('url query change', queryParams);
                this.storeSrv.refreshGrid(queryParams)
            });
        }

    }

}
