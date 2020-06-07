import { Component, ComponentFactory, ComponentFactoryResolver, ComponentRef, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicDialogRef, DynamicDialogService } from '@byzan/orion2';
import { MenuItem as OrionMenuItem } from '@byzan/orion2';
import { MenuItem, SelectItem } from 'primeng/api';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { MessageFlowEnum } from '../../enums/message-flow.enum';
import { DStoreOption } from '../../models/i-dstore';
import { IFilter } from '../../models/i-filter';
import { FILTERLOGICAND, FILTERLOGICOR, IFilterView } from '../../models/i-filter-view';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridDataService } from '../../services/grid-data.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { ArrayTool } from '../../utils/array-tool';
import { dataMap, topicFilter } from '../../utils/grid-tool';
import { ColumnFilterViewEditPanelComponent } from '../column-filter-view-edit-panel/column-filter-view-edit-panel.component';
import { FilterItemBoxComponent, FILTERITEMSETTINGPANELHEIGHT, FILTERITEMSETTINGPANELWIDTH } from '../filter-item-box/filter-item-box.component';
import { FilterItemSettingPanelComponent } from '../filter-item-setting-panel/filter-item-setting-panel.component';

@Component({
    selector: 'xcloud-grid-column-filter-panel',
    templateUrl: './column-filter-panel.component.html',
    styleUrls: ['./column-filter-panel.component.scss']
})
export class ColumnFilterPanelComponent implements OnInit {

    @ViewChild('filterItemsContainer', { static: true, read: ViewContainerRef })
    public filterItemsContainer: ViewContainerRef;
    public enableFilterView: boolean = false;
    public advanceMenuItems: Array<MenuItem>;
    public filterItemBoxs: Array<FilterItemBoxComponent> = [];
    public logicalOperations: Array<SelectItem>;
    public logicalOperation: string = FILTERLOGICAND;
    public operationMenus: Array<OrionMenuItem>;
    public constructor(
        private cfr: ComponentFactoryResolver,
        private cache: GridDataService,
        private messageFlow: GridMessageFlowService,
        private dataFlow: GridDataFlowService,
        private dialogService: DynamicDialogService
    ) {
        this.logicalOperations = [
            {
                label: '满足以下所有条件',
                value: FILTERLOGICAND
            },
            {
                label: '满足以下任意条件',
                value: FILTERLOGICOR
            }
        ];
        this.operationMenus = [
            {
                id: 'saveAs',
                label: '另存为',
                command: () => this.saveAs()
            }
        ];
    }

    public ngOnInit(): void {
        const viewDefinitionObs: Observable<Array<IFilterView>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap);
        const optionObs: Observable<DStoreOption> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.DStoreOption), dataMap);

        viewDefinitionObs.subscribe(views => {
            let view: IFilterView = views.filter(x => x['_active'])[0];
            this.logicalOperation = view.filterLogic || FILTERLOGICAND;
            this.renderFilterPanel(view.filters);
        });

        optionObs
            .pipe(take(1))
            .subscribe(option => {
                this.enableFilterView = option.enableView;
                if (!option.enableColumnFrozen) {
                    ArrayTool.remove(this.operationMenus, it => it.id === 'saveAs');
                }
            });
    }

    public renderFilterPanel(filters?: Array<IFilter>): void {
        this.clearFilterItems();
        if (filters?.length) {
            for (let it of filters) {
                this._addFilterItem(it.field, it.operator, it.value);
            }
        }
    }

    public addFilterItem(): void {
        let data: any = { columns: this.cache.getActiveFilterViewColumns() };
        const ref: DynamicDialogRef<any> = this.dialogService.open(FilterItemSettingPanelComponent, {
            header: '筛选器设置',
            width: FILTERITEMSETTINGPANELWIDTH,
            height: FILTERITEMSETTINGPANELHEIGHT,
            data
        });

        ref.afterClosed()
            .pipe(filter(x => x))
            .subscribe((res: { field: string; operator: string; value: string }) => {
                this._addFilterItem(res.field, res.operator, res.value);
            });
    }

    public clearFilterItems(): void {
        this.filterItemsContainer.clear();
        this.filterItemBoxs = [];
    }

    public cancal(): void {
        this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel, false);
    }

    public saveAs(): void {
        let view: IFilterView = this.cache.getActiveFilterView();
        view.id = null;
        view.name = null;
        view.filterLogic = this.logicalOperation;
        view.filters = this.transferFilterItemBoxToFilter();

        const ref: DynamicDialogRef<ColumnFilterViewEditPanelComponent> = this.editViewName();
        ref.afterClosed().pipe(filter(name => name)).subscribe(name => {
            let acv: IFilterView = this.cache.getActiveFilterView();
            if (acv.id === '_ALL') {
                // 如果全部视图查询过后,另存为需要清空之前的filter,否则切换回来查不到数据
                view.filterLogic = FILTERLOGICAND;
                acv.filters = [];
                this.cache.setFilterView(acv);
            }
            view.name = name;
            this.cache.setFilterView(view);
            this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view, fetchData: true });
            this.messageFlow.publish(MessageFlowEnum.ToggleFilterSettingPanel, false);
        });
    }

    public query(noSave?: boolean): void {
        let view: IFilterView = this.cache.getActiveFilterView();
        view.filterLogic = this.logicalOperation;
        view.filters = this.transferFilterItemBoxToFilter();
        this.cache.setFilterView(view);
        this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view, fetchData: true, noSave });
    }

    public saveAndQuery(): void {
        let view: IFilterView = this.cache.getActiveFilterView();
        if (view.id === '_ALL') {
            this.saveAs();
            return;
        }
        this.query();
    }

    private transferFilterItemBoxToFilter(): Array<IFilter> {
        return this.filterItemBoxs.filter(x => x.field).map(x =>
            ({
                field: x.field,
                operator: x.operator,
                value: x.value
            }));
    }

    private editViewName(viewName?: string): DynamicDialogRef<ColumnFilterViewEditPanelComponent> {
        return this.dialogService.open(ColumnFilterViewEditPanelComponent, {
            header: viewName ? '保存列表视图' : '保存新列表视图',
            width: '450px',
            height: '300px',
            data: viewName || null
        });
    }

    private _addFilterItem(field?: string, operator?: string, value?: string): void {
        let factory: ComponentFactory<FilterItemBoxComponent> = this.cfr.resolveComponentFactory(FilterItemBoxComponent);
        let com: ComponentRef<FilterItemBoxComponent> = this.filterItemsContainer.createComponent(factory);
        com.instance.id = `${Date.now()}-${field}`;
        com.instance.field = field;
        com.instance.operator = operator;
        com.instance.value = value;
        com.instance.generateDisplayMessage();
        com.instance.delete.pipe(take(1)).subscribe(id => {
            const i: number = this.filterItemBoxs.findIndex(x => x.id === id);
            if (i === -1) { return; }
            ArrayTool.remove(this.filterItemBoxs, it => it.id === id);
            this.filterItemsContainer.remove(i);
        });
        this.filterItemBoxs.push(com.instance);
    }

}
