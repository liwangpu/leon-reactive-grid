import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {
        path: 'dgrid-demo',
        loadChildren: () => import('./dgrid-demo/dgrid-demo.module').then(m => m.DgridDemoModule)
    },
    { path: '', pathMatch: 'full', redirectTo: 'dgrid-demo' },
    { path: '**', redirectTo: 'dgrid-demo' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
