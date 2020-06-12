import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducer } from './reducer';


@NgModule({
    imports: [
        StoreModule.forFeature('grid', reducer)
    ]
})
export class GridStoreModule { }
