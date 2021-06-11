import { GridComponent } from './grid/grid.component';
import { GridContentComponent } from './grid-content/grid-content.component';
import { TableHeadCellComponent } from './table-head-cell/table-head-cell.component';
import { TableContentCellComponent } from './table-content-cell/table-content-cell.component';

export * from './grid/grid.component';

export const components: Array<any> = [
    GridComponent,
    GridContentComponent,
    TableHeadCellComponent,
    TableContentCellComponent
];