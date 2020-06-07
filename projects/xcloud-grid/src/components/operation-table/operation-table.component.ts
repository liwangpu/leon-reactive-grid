import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from '@byzan/orion2';
import { Observable } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { MessageFlowEnum } from '../../enums/message-flow.enum';
import { ITableButton } from '../../models/i-table-button';
import { Table } from '../../models/table';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { GRIDCONFIG, IGridConfig } from '../../tokens/grid-config';
import { dataMap, topicFilter } from '../../utils/grid-tool';
import { ObjectTool } from '../../utils/object-tool';

@Component({
    selector: 'xcloud-grid-operation-table',
    templateUrl: './operation-table.component.html',
    styleUrls: ['./operation-table.component.scss']
})
export class OperationTableComponent extends Table implements OnInit {

    public enableRowState: boolean = true;
    public advanceButtonMenu: Array<MenuItem>;
    @ViewChild('advanceButtonMenuCt', { static: false })
    private advanceButtonMenuCt: any;
    private buttons: Array<ITableButton>;
    private dynamicTableButtonObs: (data: any) => Promise<Array<ITableButton>>;
    public constructor(
        @Inject(GRIDCONFIG)
        private gridConfig: IGridConfig,
        messageFlow: GridMessageFlowService
    ) {
        super(messageFlow);
    }

    public ngOnInit(): void {
        super.ngOnInit();

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

    }

    public async showAdvanceSetting(evt: any, data: any): Promise<void> {
        this.advanceButtonMenu = [];
        this.advanceButtonMenuCt.toggle(evt);

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

    public editRow(row: any): void {

        // this.opsat.publish(GridTopicEnum.RowOperating, {
        //     operation: 'edit',
        //     data: row
        // });
    }

}
