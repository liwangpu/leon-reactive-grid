import { ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { dataMap, topicFilter } from '../utils/grid-tool';
import { ITableColumn } from './i-table-column';

export abstract class Table implements OnInit {

    @Input()
    public columns: Array<ITableColumn> = [];
    @Input()
    public selectMode: 'single' | 'multiple' = 'multiple';
    @Input()
    public datas: Array<any> = [];
    @Input()
    public radioSelect: string;
    @Output()
    public readonly radioSelectChange: EventEmitter<string> = new EventEmitter<string>();
    public allRowSelected: boolean = false;
    @ViewChild('table', { static: true, read: ElementRef })
    public table: ElementRef;
    public enableRowState: boolean = true;
    public constructor(

    ) {

    }

    public ngOnInit(): void {
        // const enableStateObs: Observable<boolean> = this.messageFlow.message
        //     .pipe(topicFilter(MessageFlowEnum.EnableTableRowState), dataMap);

        // enableStateObs
        //     .subscribe(enable => this.enableRowState = enable);
    }

    public onRowClick(data: any): void {
        // if (!this.selectMode) { return; }
        // if (data['_level'] && data['_level'] > 1) { return; }

        // if (this.selectMode === 'single') {
        //     this.radioSelectChange.emit(data['id']);
        //     this.messageFlow.publish(MessageFlowEnum.RowSelected, [data]);
        // } else {
        //     data['_selected'] = !data['_selected'];
        //     this.allRowSelected = !this.datas.some(x => !x['_selected']);
        //     this.messageFlow.publish(MessageFlowEnum.RowSelected, this.datas.filter(x => x['_selected']));
        // }
        // console.log('row select', data['id']);
        // console.log('row click', this.datas.filter(x => x['_selected']));
    }

    public trackByDataFn(index: number, it: { id: any }): string {
        return it.id;
    }

    public trackByColumnFn(inde: number, it: { field: string }): string {
        return it.field;
    }

}
