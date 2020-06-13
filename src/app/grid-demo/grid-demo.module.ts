import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridDemoRoutingModule } from './grid-demo-routing.module';
import { StudentListComponent } from './components/student-list/student-list.component';
import { GridModule, GRIDCONFIG, QUERYPARAMTRANSFORMPOLICY } from '@cxist/xcloud-grid';
import { DataFakerComponent } from './components/data-faker/data-faker.component';
import { GridQueryParamTransformPolicyService } from '../services/grid-query-param-transform-policy.service';

@NgModule({
    declarations: [StudentListComponent, DataFakerComponent],
    imports: [
        CommonModule,
        GridDemoRoutingModule,
        GridModule
    ],
    providers: [
        {
            provide: GRIDCONFIG,
            useValue: {
                idProperty: 'id',
                rowsPerPageOptions: [20, 50, 100]
            }
        },
        {
            provide: QUERYPARAMTRANSFORMPOLICY,
            useExisting: GridQueryParamTransformPolicyService
        },
    ]
})
export class GridDemoModule { }
