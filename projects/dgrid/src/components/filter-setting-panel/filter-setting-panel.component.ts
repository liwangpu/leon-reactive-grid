import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem as OrionMenuItem } from '@byzan/orion2';
import { GridStoreService } from '../../services';
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
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService,
    ) { }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.operationMenus = [
            {
                id: 'saveAs',
                label: '另存为',
                command: () => this.saveAs()
            }
        ];
        this.subs.sink = this.storeSrv.viewMode$.subscribe(enable => {
            this.enableFilterView = enable;
        });
    }

    public query(): void {

    }

    public saveAs(): void {

    }

    public saveAndQuery(): void {

    }
}
