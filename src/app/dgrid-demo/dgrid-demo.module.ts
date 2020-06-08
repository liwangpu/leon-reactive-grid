import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DgridDemoRoutingModule } from './dgrid-demo-routing.module';
import { StudentListComponent } from './components/student-list/student-list.component';
import { DGridModule } from 'dgrid';


@NgModule({
  declarations: [StudentListComponent],
  imports: [
    CommonModule,
    DgridDemoRoutingModule,
    DGridModule
  ]
})
export class DGridDemoModule { }
