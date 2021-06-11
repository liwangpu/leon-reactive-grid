import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import * as fromComponent from './components/public-api';

@NgModule({
    declarations: [...fromComponent.components],
    imports: [
        CommonModule
    ],
    exports: [fromComponent.GridComponent]
})
export class DgridModule { }
