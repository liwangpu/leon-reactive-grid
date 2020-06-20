import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';


const routes: Routes = [
    // {
    //     path: '',
    //     component: HomeComponent
    // },
    {
        path: 'dgrid-demo',
        loadChildren: () => import('./dgrid-demo/dgrid-demo.module').then(m => m.DGridDemoModule)
    },
    { path: '**', redirectTo: '' }
    // { path: '**', redirectTo: 'grid-demo/student-list' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
