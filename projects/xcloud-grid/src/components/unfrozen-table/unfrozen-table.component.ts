import { Component, EventEmitter, forwardRef, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { MessageFlowEnum } from '../../enums/message-flow.enum';
import { ResizableTable } from '../../models/resizable-table';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridDataService } from '../../services/grid-data.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';

@Component({
    selector: 'xcloud-grid-unfrozen-table',
    templateUrl: './unfrozen-table.component.html',
    styleUrls: ['./unfrozen-table.component.scss'],
    providers: [
        {
            provide: ResizableTable,
            useExisting: forwardRef(() => UnFrozenTableComponent)
        }
    ]
})
export class UnFrozenTableComponent extends ResizableTable implements OnInit {

    @Output()
    public readonly freezeColumn: EventEmitter<string> = new EventEmitter<string>();
    public currentEditColumn: string;
    protected tableType: 'frozen' | 'unfrozen' = 'unfrozen';
    public constructor(
        renderer2: Renderer2,
        cache: GridDataService,
        dataFlow: GridDataFlowService,
        messageFlow: GridMessageFlowService
    ) {
        super(renderer2, cache, dataFlow, messageFlow);
        this.advanceColSettingMenu = [
            {
                id: 'freezen-column',
                label: '冻结此列',
                command: () => {
                    this.advanceButtonMenuCt.hide();
                    this.cache.freezeColumn(this.currentEditColumn);
                    this.messageFlow.publish(MessageFlowEnum.FilterViewChange, { view: this.cache.getActiveFilterView(), fetchData: false });
                }
            }
        ];
    }

    public ngOnInit(): void {
        super.ngOnInit();
    }

}
