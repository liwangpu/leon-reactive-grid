import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DgridDemoRoutingModule } from './dgrid-demo-routing.module';
import { UsersComponent } from './components/users/users.component';
import { DgridModule } from 'dgrid';

@NgModule({
    declarations: [UsersComponent],
    imports: [
        CommonModule,
        DgridDemoRoutingModule,
        DgridModule
    ]
})
export class DgridDemoModule { }
