import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { gridReducer } from './reducer';

@NgModule({
    imports: [
        StoreModule.forFeature('grid', gridReducer)
    ]
})
export class GridStoreModule { }
