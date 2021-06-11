import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
    { path: 'users', component: UsersComponent },
    { path: '', pathMatch: 'full', redirectTo: 'users' },
    { path: '**', redirectTo: 'users' }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DgridDemoRoutingModule { }
