import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import * as fromModel from '../../models';

@Component({
    selector: 'mirror-table-content-cell',
    templateUrl: './table-content-cell.component.html',
    styleUrls: ['./table-content-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableContentCellComponent implements OnInit {

    @Input()
    public readonly column: fromModel.ITableColumn;
    @Input()
    public readonly data: { [key: string]: any };
    public constructor() { }

    ngOnInit(): void {
    }

}
