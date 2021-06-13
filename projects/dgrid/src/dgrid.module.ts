import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import * as fromComponent from './components/public-api';
import * as fromDirective from './directives/public-api';

@NgModule({
    declarations: [...fromComponent.components, ...fromDirective.directives],
    imports: [
        CommonModule
    ],
    exports: [fromComponent.GridComponent]
})
export class DgridModule { }
