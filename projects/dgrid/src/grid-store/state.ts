export interface IGridState {
    grid: { [key: string]: IGridData }
}


export interface IGridData {
    pagination?: IGridPagination;
}

export interface IGridPagination {
    page?: number;
    limit?: number;
}