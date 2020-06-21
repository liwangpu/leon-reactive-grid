import { Component, OnInit, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { MenuItem as OrionMenuItem } from '@byzan/orion2';
import { GridStoreService } from '../../services';
import * as fromModel from '../../models';
import * as fromConst from '../../consts';
import { SubSink } from 'subsink';
import { FilterSettingItemComponent } from '../filter-setting-item/filter-setting-item.component';

@Component({
    selector: 'dgrid-filter-setting-panel',
    templateUrl: './filter-setting-panel.component.html',
    styleUrls: ['./filter-setting-panel.component.scss']
})
export class FilterSettingPanelComponent implements OnInit, OnDestroy {

    public keyword: string;
    public enableFilterView: boolean;
    public operationMenus: Array<OrionMenuItem>;
    public showViewPanel: boolean;
    public viewName: string;
    public filters: Array<fromModel.IFilter>;
    @ViewChildren(FilterSettingItemComponent)
    private filterItems: QueryList<FilterSettingItemComponent>;
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
        this.subs.sink = this.storeSrv.activeView$.subscribe(view => {
            this.viewId = view.id;
            this.filters = [];
            const filters = view.filters || [];
            view.columns.forEach(col => {
                // tslint:disable-next-line: max-line-length
                let filter: fromModel.IFilter = filters.filter(f => f.field === col.field)[0] || { field: col.field, operator: null, value: null };
                filter = { ...filter };
                // tslint:disable-next-line: no-string-literal
                filter['name'] = col.name;
                // tslint:disable-next-line: no-string-literal
                filter['type'] = col.fieldType;
                this.filters.push(filter);
            });
        });
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
        const filters: Array<fromModel.IFilter> = [];
        this.filterItems.forEach(it => filters.push(it.getFilter()));
        this.storeSrv.saveViewAndLoadData(filters);
    }

    public trackByFilterFn(it: fromModel.IFilter): string {
        return it.field;
    }
}
