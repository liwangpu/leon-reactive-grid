import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { MenuItem as OrionMenuItem } from '@byzan/orion2';
import { GridStoreService } from '../../services';
import * as fromModel from '../../models';
import * as fromConst from '../../consts';
import { SubSink } from 'subsink';

@Component({
    selector: 'dgrid-filter-setting-panel',
    templateUrl: './filter-setting-panel.component.html',
    styleUrls: ['./filter-setting-panel.component.scss']
})
export class FilterSettingPanelComponent implements OnInit, OnDestroy {

    public keyword: string;
    public enableFilterView: boolean = true;
    public operationMenus: Array<OrionMenuItem>;
    public columns: Array<fromModel.ITableColumn>;
    public showViewPanel: boolean;
    public viewName: string;
    private viewId: string;
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService,
    ) { }

    public get defaultView(): boolean {
        return this.viewId === fromConst.DEFAULT_VIEW_ID;
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.operationMenus = [
            {
                id: 'saveAs',
                label: '另存为',
                command: () => {
                    this.viewName = '';
                    this.showViewPanel = true;
                }
            }
        ];
        this.subs.sink = this.storeSrv.viewMode$.subscribe(enable => this.enableFilterView = enable);
        this.subs.sink = this.storeSrv.activeViewId$.subscribe(id => this.viewId = id);
        this.subs.sink = this.storeSrv.activeColumns$.subscribe(cols => this.columns = cols);
    }

    public query(): void {
        this.storeSrv.loadData();
    }

    public saveAs(): void {
        this.storeSrv.saveViewAs(this.viewName);
        this.viewName = '';
        this.showViewPanel = false;
    }

    public saveAndQuery(): void {
        if (this.defaultView) {
            this.query();
            return;
        }

        this.storeSrv.saveViewAndLoadData();
    }

    public trackByColumnFn(inde: number, it: { field: string }): string {
        return it.field;
    }
}
