import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StudentListComponent } from './components/student-list/student-list.component';
import { DataFakerComponent } from './components/data-faker/data-faker.component';


const routes: Routes = [
    {
        path: 'student-list',
        component: StudentListComponent
    },
    {
        path: 'data-faker',
        component: DataFakerComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class GridDemoRoutingModule { }
