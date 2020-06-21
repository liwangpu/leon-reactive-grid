import * as fromModel from '../models';

export interface IGridState {
    grid: { [key: string]: IGridData }
}


export interface IGridData {
    pagination?: IGridPagination;
    activeViewId?: string;
    view: { [key: string]: fromModel.IFilterView };
}

export interface IGridPagination {
    page?: number;
    limit?: number;
}


export enum gridParamEnum {
    startupOption = 'startupOption',
    views = 'views',
    activeColumns = 'activeColumns',
    pagination = 'pagination',
    activeView = 'activeView',
    datas = 'datas',
    dataCount = 'dataCount',
    advanceSettingPanel = 'advanceSettingPanel',
    enableFilterView = 'enableFilterView',
    searchKeyword = 'searchKeyword',
    sort = 'sort',
    rowsPerPageOptions = 'rowsPerPageOptions'
}