import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
    // {
    //     path: '',
    //     component: HomeComponent
    // },
    {
        path: 'grid-demo',
        loadChildren: () => import('./grid-demo/grid-demo.module').then(m => m.GridDemoModule)
    },
    // { path: '**', redirectTo: '' }
    { path: '**', redirectTo: 'grid-demo/student-list' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
