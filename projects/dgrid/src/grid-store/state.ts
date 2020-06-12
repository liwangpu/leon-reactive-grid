import * as fromModel from '../models';

export interface IGridState {
    grid: { [key: string]: IGridData }
}


export interface IGridData {
    pagination?: IGridPagination;
    view: { [key: string]: fromModel.IFilterView };
}

export interface IGridPagination {
    page?: number;
    limit?: number;
}