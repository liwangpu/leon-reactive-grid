import { Component, OnInit, OnDestroy } from '@angular/core';
import { GridStoreService } from '../../services';
import { SubSink } from 'subsink';
import { SelectItem } from '@byzan/orion2';

@Component({
    selector: 'dgrid-header',
    templateUrl: './grid-header.component.html',
    styleUrls: ['./grid-header.component.scss']
})
export class GridHeaderComponent implements OnInit, OnDestroy {

    public displayMode = 'browser';
    public enableFilterView: boolean;
    public allViews: Array<SelectItem> = [];
    public activeViewId: string;
    public keyword: string;
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService
    ) { }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.storeSrv.views$.subscribe(views => {
            this.allViews = views.map(x => ({ value: x.id, label: x.name }));
        });

        this.subs.sink = this.storeSrv.activeViewId$.subscribe(viewId => {
            this.activeViewId = viewId;
        });

        this.subs.sink = this.storeSrv.searchKeyword$.subscribe(keyword => this.keyword = keyword);
    }

    public changeActiveView(): void {
        this.storeSrv.changeActiveView(this.activeViewId);
    }

    public search(): void {
        this.storeSrv.setSearchKeyword(this.keyword);
    }

    public refresh(): void {
        this.storeSrv.loadData();
    }

    public reset(): void {
        this.storeSrv.resetView();
    }

}
