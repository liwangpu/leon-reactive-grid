import { Component, OnInit, Input } from '@angular/core';
import { ITableColumn } from '../../models/i-table-column';
import { Observable } from 'rxjs';
import { IFilterView } from '../../models/i-filter-view';
import { topicFilter, dataMap } from '../../utils/grid-tool';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { GridDataService } from '../../services/grid-data.service';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';

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
    public columns: Array<ITableColumn> = [];
    public constructor(
        protected cache: GridDataService,
        protected dataFlow: GridDataFlowService,
        protected messageFlow: GridMessageFlowService
    ) { }

    public ngOnInit(): void {
        const viewDefinitionObs: Observable<Array<IFilterView>> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ViewDefinition), dataMap);

        viewDefinitionObs
            .subscribe(views => {
                let view: IFilterView = views.filter(x => x['_active'])[0];
                this.columns = view.columns.filter(x => !x['_invisibale']);
                console.log(1, this.columns,this.datas);
                // if (this.nestedDataLevel > 1) {
                //     if (this.tableType === 'unfrozen') {
                //         this.shownNestedData = !cols.some(x => x['_frozen']);
                //     } else if (this.tableType === 'frozen') {
                //         this.shownNestedData = cols.some(x => x['_frozen']);
                //     } else {
                //         //
                //     }
                // }
            });
    }

    public trackByDataFn(index: number, it: { id: any }): string {
        return it.id;
    }

}
