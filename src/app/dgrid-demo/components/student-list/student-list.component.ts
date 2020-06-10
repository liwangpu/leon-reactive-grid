import { Component, OnInit, forwardRef } from '@angular/core';
import { DStore, LocalViewDStore, ITableColumn, IQueryResult } from 'dgrid';

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


    public constructor() {
        super();
    }

    public ngOnInit(): void {
        this.gridStartup();
    }

    public async getColumns(): Promise<Array<ITableColumn>> {
        return [];
    }

    public async onQuery(queryParam?: { [key: string]: any; }): Promise<IQueryResult<any>> {
        return {};
    }

}
