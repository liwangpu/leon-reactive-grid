import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import * as fromModel from '../../models';
import { GridStoreService } from '../../services';
import { SubSink } from 'subsink';
import { ColumnSettingPanelComponent } from '../column-setting-panel/column-setting-panel.component';
import { FilterSettingPanelComponent } from '../filter-setting-panel/filter-setting-panel.component';

@Component({
    selector: 'dgrid-content',
    templateUrl: './grid-content.component.html',
    styleUrls: ['./grid-content.component.scss']
})
export class GridContentComponent implements OnInit, OnDestroy {

    public showFilterView: boolean = false;
    public columns: Array<fromModel.ITableColumn>;
    public datas: Array<any>;
    public advanceSettingPanel: string;
    @ViewChild('advancePanelAnchor', { static: false, read: ViewContainerRef })
    private advancePanelAnchor: ViewContainerRef;
    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService,
        private cfr: ComponentFactoryResolver
    ) { }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public ngOnInit(): void {
        this.subs.sink = this.storeSrv.activeColumns$.subscribe(cols => {
            // console.log('cols', cols);
            this.columns = cols;
        });

        this.subs.sink = this.storeSrv.datas$.subscribe(datas => {
            // console.log('datas', datas);
            this.datas = datas;
        });

        this.subs.sink = this.storeSrv.advanceSettingPanel$.subscribe(panel => {
            // console.log('panel', panel);
            if (!this.advancePanelAnchor) { return; }
            this.advanceSettingPanel = panel;
            this.advancePanelAnchor.clear();
            if (panel === 'column-seting') {
                const fac: any = this.cfr.resolveComponentFactory(ColumnSettingPanelComponent);
                this.advancePanelAnchor.createComponent(fac);
                return;
            }

            if (panel === 'filter-seting') {
                const fac: any = this.cfr.resolveComponentFactory(FilterSettingPanelComponent);
                this.advancePanelAnchor.createComponent(fac);
                return;
            }
        });

        setTimeout(() => {
            // this.changeAdvanceSettingPanel('column-seting');
            // this.changeAdvanceSettingPanel('filter-seting');
        }, 50);
    }

    public changeAdvanceSettingPanel(panel: string) {
        if (this.advanceSettingPanel === panel) { panel = null; }
        this.storeSrv.changeAdvanceSettingPanel(panel);
    }

}
