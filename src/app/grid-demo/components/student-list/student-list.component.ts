import { Component, OnInit, forwardRef } from '@angular/core';
import { LocalViewDStore, ITableColumn, IQueryResult, ColumnTypeEnum, DStore } from '@cxist/xcloud-grid';
import { StudentService } from '../../services/student.service';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
    providers: [
        {
            provide: DStore,
            useExisting: forwardRef(() => StudentListComponent)
        }
    ]
})
export class StudentListComponent extends LocalViewDStore implements OnInit {

    constructor(private studentSrv: StudentService) {
        super();
    }

    public ngOnInit(): void {
        this.gridStartup();
    }


    public async getColumns(): Promise<Array<ITableColumn>> {
        let cols: Array<ITableColumn> = [
            {
                field: 'name',
                name: '姓名',
                fieldType: ColumnTypeEnum.String,
                sort: true
            },
            {
                field: 'age',
                name: '年纪',
                fieldType: ColumnTypeEnum.String,
                sort: true
            },
            {
                field: 'address',
                name: '地址',
                fieldType: ColumnTypeEnum.String
            }
        ];
        return cols;
    }

    public onQuery(queryParam?: { [key: string]: any; }): Promise<IQueryResult<any>> {
        return this.studentSrv.query(queryParam).toPromise();
    }

}
