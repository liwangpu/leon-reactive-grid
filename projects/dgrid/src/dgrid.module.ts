import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './components/grid/grid.component';
import { GridHeaderComponent } from './components/grid-header/grid-header.component';
import { GridContentComponent } from './components/grid-content/grid-content.component';
import { GridFooterComponent } from './components/grid-footer/grid-footer.component';

@NgModule({
  declarations: [GridComponent, GridHeaderComponent, GridContentComponent, GridFooterComponent],
  imports: [
    CommonModule
  ]
})
export class DGridModule { }
