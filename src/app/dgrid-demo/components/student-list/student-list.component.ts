import { Component, OnInit, forwardRef } from '@angular/core';
import * as fromDGrid from 'dgrid';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
    providers: [
        {
            provide: fromDGrid.DStore,
            useExisting: forwardRef(() => StudentListComponent)
        }
    ]
})
export class StudentListComponent extends fromDGrid.LocalViewDStore implements OnInit {


    public constructor() {
        super();
    }

    public ngOnInit(): void {
        // this.gridStartup();
    }

    public async getColumns(): Promise<Array<fromDGrid.ITableColumn>> {
        let cols: Array<fromDGrid.ITableColumn> = [
            {
                field: 'name',
                name: '姓名',
                fieldType: fromDGrid.ColumnTypeEnum.String,
                sort: true
            },
            {
                field: 'age',
                name: '年纪很长很长的名字哈哈哈哈12323213',
                fieldType: fromDGrid.ColumnTypeEnum.String,
                sort: true
            },
            {
                field: 'address',
                name: '地址',
                fieldType: fromDGrid.ColumnTypeEnum.String
            },
            {
                field: 'remark',
                name: '备注',
                fieldType: fromDGrid.ColumnTypeEnum.String
            }
        ];
        return cols;
    }

    public async onQuery(queryParam?: { [key: string]: any; }): Promise<fromDGrid.IQueryResult<any>> {
        return {};
    }

}
