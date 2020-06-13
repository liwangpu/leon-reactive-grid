import { Component, OnInit, forwardRef } from '@angular/core';
import * as fromDGrid from 'dgrid';
import { StudentService } from 'src/app/services/student.service';

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


    constructor(private studentSrv: StudentService) {
        super();
    }

    public ngOnInit(): void {
        this.gridStartup();
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
                name: '年纪',
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

    public onQuery(queryParam?: { [key: string]: any; }): Promise<fromDGrid.IQueryResult<any>> {
        return this.studentSrv.query(queryParam).toPromise();
    }

}
