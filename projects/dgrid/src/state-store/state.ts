import { IFilterView } from '../models/i-filter-view';



export interface IGridState {
    grid?: { [key: string]: IGridData };
}

export interface IGridData {
    activeViewId?: string;
    keyword?: string;
    pagination?: IGridPagination;
    sorting?: IGridSorting;
    views: { [key: string]: Array<IFilterView> };
}

export interface IGridPagination {
    page?: number;
    limit?: number
}

export interface IGridSorting {
    field?: string;
    direction?: string
}