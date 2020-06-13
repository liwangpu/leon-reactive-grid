import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridStoreService } from '../../services';
import { SubSink } from 'subsink';
import { SelectItem } from '@byzan/orion2';
import { take } from 'rxjs/operators';

@Component({
    selector: 'dgrid-header',
    templateUrl: './grid-header.component.html',
    styleUrls: ['./grid-header.component.scss']
})
export class GridHeaderComponent implements OnInit, OnDestroy {

    public displayMode: string = 'browser';
    public enableFilterView: boolean = true;
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
            // console.log(111, views);
            this.allViews = views.map(x => ({ value: x.id, label: x.name }));
        });

        this.subs.sink = this.storeSrv.activeViewId$.subscribe(viewId => {
            // console.log(11111,viewId);
            this.activeViewId = viewId;
        });
    }

    public changeActiveView(): void {
        // this.cache.initializeHistory();
        // this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel, false);
        // this.cache.setActiveViewId(this.activeView);
        // this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

    public search(): void {

    }

}
