import { IFilterView } from '../models/i-filter-view';


export interface IGridState {
    grid?: { [key: string]: IGridData };
}


interface IGridDataBase {
    id: string;
}

export interface IGridData extends IGridDataBase {
    activeViewId?: string;
    keyword?: string;
    pagination?: IGridPagination;
    sorting?: IGridSorting;
    views: { [key: string]: Array<IFilterView> };
}

export interface IGridPagination extends IGridDataBase {
    page?: number;
    limit?: number
}

export interface IGridSorting extends IGridDataBase {
    field?: string;
    direction?: string
}