import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DgridDemoRoutingModule } from './dgrid-demo-routing.module';
import { StudentListComponent } from './components/student-list/student-list.component';
import { DGridModule, GRIDCONFIG } from 'dgrid';


@NgModule({
    declarations: [StudentListComponent],
    imports: [
        CommonModule,
        DgridDemoRoutingModule,
        DGridModule
    ],
    providers: [
        {
            provide: GRIDCONFIG,
            useValue: {
                idProperty: 'id',
                rowsPerPageOptions: [20, 50, 100]
            }
        },
    ]
})
export class DGridDemoModule { }
