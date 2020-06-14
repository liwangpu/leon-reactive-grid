import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { GridEffect } from './grid-effect';
import { GridEffectService } from '../services/grid-effect.service';

@NgModule({
    imports: [
        StoreModule.forFeature('grid', reducer),
        EffectsModule.forFeature()
    ],
    providers:[
        
    ]
})
export class GridStoreModule { }
