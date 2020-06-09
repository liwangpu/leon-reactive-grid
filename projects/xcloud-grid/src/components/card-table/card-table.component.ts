import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem } from '@byzan/orion2';
import { Observable } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { MessageFlowEnum } from '../../enums/message-flow.enum';
import { IFilterView } from '../../models/i-filter-view';
import { ITableButton } from '../../models/i-table-button';
import { ITableColumn } from '../../models/i-table-column';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridDataService } from '../../services/grid-data.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { dataMap, topicFilter } from '../../utils/grid-tool';
import { ObjectTool } from '../../utils/object-tool';

@Component({
    selector: 'xcloud-grid-card-table',
    templateUrl: './card-table.component.html',
    styleUrls: ['./card-table.component.scss']
})
export class CardTableComponent implements OnInit {

    @Input()
    public selectMode: 'single' | 'multiple' = 'multiple';
    @Input()
    public datas: Array<any> = [];
    @Input()
    public radioSelect: string;
    @Output()
    public readonly radioSelectChange: EventEmitter<string> = new EventEmitter<string>();
    public advanceButtonMenu: Array<MenuItem>;
    public allRowSelected: boolean = false;
    public columns: Array<ITableColumn> = [];
    @ViewChild('advanceButtonMenuCt', { static: false })
    private advanceButtonMenuCt: any;
    private buttons: Array<ITableButton>;
    private dynamicTableButtonObs: (data: any) => Promise<Array<ITableButton>>;
    public constructor(
        protected cache: GridDataService,
        protected dataFlow: GridDataFlowService,
        protected messageFlow: GridMessageFlowService
    ) { }

    public ngOnInit(): void {
        const viewDefinitionObs: Observable<Array<IFilterView>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap);
        const tableButtonObs: Observable<Array<ITableButton>> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.TableButtons), dataMap);
        const dynamicTableButtonObs: Observable<(data: any) => Promise<Array<ITableButton>>> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.DynamicTableButtons), dataMap);

        tableButtonObs
            .pipe(take(1))
            .subscribe(buttons => {
                this.buttons = buttons;
            });

        dynamicTableButtonObs
            .pipe(take(1), filter(x => x !== undefined))
            .subscribe(obs => {
                this.dynamicTableButtonObs = obs;
            });
        viewDefinitionObs
            .subscribe(views => {
                let view: IFilterView = views.filter(x => x['_active'])[0];
                this.columns = view.columns.filter(x => !x['_invisibale']);
            });
    }

    public onSelect(data: any): void {
        if (!this.selectMode) { return; }
        if (data['_level'] && data['_level'] > 1) { return; }

        if (this.selectMode === 'single') {
            this.radioSelectChange.emit(data['id']);
            this.messageFlow.publish(MessageFlowEnum.RowSelected, [data]);
        } else {
            data['_selected'] = !data['_selected'];
            this.allRowSelected = !this.datas.some(x => !x['_selected']);
            this.messageFlow.publish(MessageFlowEnum.RowSelected, this.datas.filter(x => x['_selected']));
        }
    }

    public trackByDataFn(index: number, it: { id: any }): string {
        return it.id;
    }

    public async showAdvanceSetting(evt: any, data: any): Promise<void> {
        this.advanceButtonMenu = [];
        this.advanceButtonMenuCt.toggle(evt);
        if (this.buttons?.length) {
            for (let btn of this.buttons) {
                let visible: boolean = true;
                let enable: boolean = true;
                if (btn.visible) {
                    visible = await btn.visible(data);
                    if (!visible) { continue; }
                }

                if (btn.enable) {
                    enable = await btn.enable(data);
                }

                let menu: MenuItem = {
                    id: btn.key,
                    icon: btn.icon,
                    label: btn.name,
                    disabled: !enable,
                    command: () => {
                        this.advanceButtonMenuCt.hide();
                        if (btn.onClick) {
                            btn.onClick(data, btn.key);
                        }
                        this.messageFlow.publish(MessageFlowEnum.OperationButtonClick, { data: ObjectTool.deepCopy(data), key: btn.key, button: ObjectTool.deepCopy(btn), buttonType: 'static' });
                    }
                };
                this.advanceButtonMenu.push(menu);
            }
        }

        if (this.dynamicTableButtonObs) {
            let dyButtons: Array<MenuItem> = [];
            let btns: Array<ITableButton> = await this.dynamicTableButtonObs(data);
            // console.log('request button obs');
            for (let btn of btns) {
                let menu: MenuItem = {
                    id: btn.key,
                    icon: btn.icon,
                    label: btn.name,
                    // tslint:disable-next-line: no-identical-functions
                    command: () => {
                        this.advanceButtonMenuCt.hide();
                        if (btn.onClick) {
                            btn.onClick(data, btn.key);
                        }
                        this.messageFlow.publish(MessageFlowEnum.OperationButtonClick, { data: ObjectTool.deepCopy(data), key: btn.key, button: ObjectTool.deepCopy(btn), buttonType: 'dynamic' });
                    }
                };
                dyButtons.push(menu);
            }
            // this.tableRowDynamicButtonLoaddingState.set(data[idProperty], dyButtons);
            this.advanceButtonMenu = this.advanceButtonMenu.concat(dyButtons);
        }
    }
}
