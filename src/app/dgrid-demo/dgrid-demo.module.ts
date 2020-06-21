import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DgridDemoRoutingModule } from './dgrid-demo-routing.module';
import { StudentListComponent } from './components/student-list/student-list.component';
import * as fromDGrid from 'dgrid';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [StudentListComponent, HomeComponent],
    imports: [
        CommonModule,
        DgridDemoRoutingModule,
        fromDGrid.DGridModule
    ],
    providers: [

    ]
})
export class DGridDemoModule { }
