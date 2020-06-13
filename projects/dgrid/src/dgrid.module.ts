import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SlideMenuModule } from 'primeng/slidemenu';
import { GridStoreModule } from './grid-store';
import * as fromOrion from '@byzan/orion2';
import * as fromDirective from './directives';
import * as fromComponent from './components';

@NgModule({
    declarations: [...fromComponent.components, fromDirective.directives],
    imports: [
        CommonModule,
        GridStoreModule,
        ReactiveFormsModule,
        FormsModule,
        SlideMenuModule,
        fromOrion.InputModule,
        fromOrion.DynamicDialogModule,
        fromOrion.FormModule,
        fromOrion.SelectModule,
        fromOrion.ButtonModule,
        fromOrion.CheckboxModule,
        fromOrion.RadioButtonModule,
        fromOrion.SplitButtonModule,
        fromOrion.TooltipModule
    ],
    exports: [
        fromComponent.GridComponent
    ]
})
export class DGridModule { }
