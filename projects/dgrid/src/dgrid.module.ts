import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent, GridHeaderComponent, GridContentComponent, GridFooterComponent } from './components';
import { GridStoreModule } from './state-store';


@NgModule({
    declarations: [GridComponent, GridHeaderComponent, GridContentComponent, GridFooterComponent],
    imports: [
        CommonModule,
        GridStoreModule
    ],
    exports: [
        GridComponent
    ]
})
export class DGridModule { }
