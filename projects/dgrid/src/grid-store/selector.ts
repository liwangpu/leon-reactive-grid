import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromState from './state';
import * as  fromReducer from './reducer';

const selectDGridData = createFeatureSelector<{ [key: string]: any }>('grid');

export const selectActiveViewId = (id: string) => createSelector(
    selectDGridData,
    grid => {
        let view = grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.activeView))];
        return view?.id;
    }
);

export const selectPagination = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.pagination))]
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

export const selectViews = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.views))]
);

export const selectViewMode = (id: string) => createSelector(
    selectDGridData,
    grid => grid[(fromReducer.generatePropertyKey(id, fromState.gridParamEnum.enableFilterView))]
);