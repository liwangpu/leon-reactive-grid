import { Component, Inject, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DataFlowTopicEnum } from '../../enums/data-flow-topic.enum';
import { MessageFlowEnum } from '../../enums/message-flow.enum';
import { IHistory } from '../../models/i-history';
import { IQueryResult } from '../../models/i-query-result';
import { GridDataFlowService } from '../../services/grid-data-flow.service';
import { GridDataService } from '../../services/grid-data.service';
import { GridMessageFlowService } from '../../services/grid-message-flow.service';
import { GRIDCONFIG, IGridConfig } from '../../tokens/grid-config';
import { dataMap, topicFilter } from '../../utils/grid-tool';

@Component({
    selector: 'xcloud-grid-footer',
    templateUrl: './grid-footer.component.html',
    styleUrls: ['./grid-footer.component.scss']
})
export class GridFooterComponent implements OnInit {

    @Input()
    public displayMode: string;
    public rows: number;
    public rowsPerPageOptions: Array<number>;
    public dataTotal: number = 0;
    public paginatorFirst: number = 0;
    public constructor(
        @Inject(GRIDCONFIG) private gridConfig: IGridConfig,
        private cache: GridDataService,
        private dataFlow: GridDataFlowService,
        private messageFlow: GridMessageFlowService
    ) {
        this.rowsPerPageOptions = this.gridConfig.rowsPerPageOptions;
        this.rows = this.rowsPerPageOptions[0];
    }

    public ngOnInit(): void {
        const listDataObs: Observable<IQueryResult> = this.dataFlow.message
            .pipe(topicFilter(DataFlowTopicEnum.ListData), dataMap);
        const historyObs: Observable<IHistory> = this.messageFlow.message
            .pipe(topicFilter(MessageFlowEnum.History), dataMap);

        listDataObs
            .subscribe(res => {
                if (res.count) {
                    this.dataTotal = res.count;
                }
            });

        historyObs
            .pipe(delay(100))
            .subscribe(history => {
                if (history.pagination && history.pagination.page && history.pagination.limit) {
                    this.paginatorFirst = (history.pagination.page - 1) * history.pagination.limit;
                }
                this.rows = this.rowsPerPageOptions[0];
                // console.log(111, this.rows);
            });
    }

    public paginate(evt: { first: number; rows: number; page: number }): void {
        // console.log('paginate', evt);
        this.paginatorFirst = evt.first;
        this.cache.setPagination(evt.page + 1, evt.rows);
        this.dataFlow.publish(DataFlowTopicEnum._History, this.cache.getHistory());
    }

}
