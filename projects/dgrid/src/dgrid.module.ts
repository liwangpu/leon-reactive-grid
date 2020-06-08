import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent, GridHeaderComponent, GridContentComponent, GridFooterComponent } from './components';


@NgModule({
    declarations: [GridComponent, GridHeaderComponent, GridContentComponent, GridFooterComponent],
    imports: [
        CommonModule
    ],
    exports: [
        GridComponent
    ]
})
export class DGridModule { }
