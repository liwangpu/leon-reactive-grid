import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromState from './state';
import * as  fromReducer from './reducer';
import * as fromModel from '../models';

const selectDGridData = createFeatureSelector<{ [key: string]: any }>('grid');

export const selectActiveView = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.activeView))]
);

export const selectActiveViewId = (id: string) => createSelector(
    selectActiveView(id),
    (view: fromModel.IFilterView) => view?.id
);

export const selectPagination = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.pagination))]
);

export const selectRowsPerPageOptions = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.rowsPerPageOptions))]
);

export const selectAdvanceSettingPanel = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.advanceSettingPanel))]
);

export const selectActiveColumns = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.activeColumns))]
);

export const selectDatas = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.datas))]
);

export const selectDataCount = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.dataCount))]
);

export const selectViews = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.views))]
);

export const selectViewMode = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.enableFilterView))]
);

export const selectSearchKeyword = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.searchKeyword))]
);

export const selectSort = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.sort))]
);