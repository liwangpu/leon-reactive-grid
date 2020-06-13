import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { GridEffect } from './grid-effect';

@NgModule({
    imports: [
        StoreModule.forFeature('grid', reducer)
    ]
})
export class GridStoreModule { }
