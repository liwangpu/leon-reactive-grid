import { createReducer, Action, on } from '@ngrx/store';
import * as fromState from './state';
import * as fromAction from './action';
import * as fromModel from '../models';

export function generatePropertyKey(id: string, property: string): string {
    return `[${id}][${property}]`;
}

function generatePropertyValue(id: string, property: string, value?: any): { [key: string]: any } {
    return { [generatePropertyKey(id, property)]: value };
}

function getStartupOption(state: {}, id): fromModel.DStoreOption {
    let value = state[generatePropertyKey(id, fromState.gridParamEnum.startupOption)];
    if (!value) { return {}; }
    return { ...value };
}

function getSearchKeyword(state: {}, id): string {
    return state[generatePropertyKey(id, fromState.gridParamEnum.searchKeyword)];
}

function getViews(state: {}, id): Array<fromModel.IFilterView> {
    let value = state[generatePropertyKey(id, fromState.gridParamEnum.views)];
    if (!value) { return []; }
    return [...value];
}

function getActiveView(state: {}, id): fromModel.IFilterView {
    let value = state[generatePropertyKey(id, fromState.gridParamEnum.activeView)];
    if (!value) { return null; }
    return { ...value };
}

function getActiveColumns(state: {}, id): Array<fromModel.ITableColumn> {
    let value = state[generatePropertyKey(id, fromState.gridParamEnum.activeColumns)];
    if (!value) { return null; }
    return [...value];
}

function getPagination(state: {}, id): { page: number; limit: number } {
    let value = state[generatePropertyKey(id, fromState.gridParamEnum.pagination)];
    if (!value) { return null; }
    return { ...value };
}

function getSort(state: {}, id): fromModel.ISortEvent {
    let value = state[generatePropertyKey(id, fromState.gridParamEnum.sort)];
    if (!value) { return null; }
    return { ...value };
}

function getRowsPerPageOptions(state: {}, id): Array<number> {
    let value = state[generatePropertyKey(id, fromState.gridParamEnum.rowsPerPageOptions)];
    if (!value) { return []; }
    return [...value];
}

export const gridReducer = createReducer(
    {},
    on(fromAction.clearStoreData, (state: {}, { id }) => {
        let store = { ...state };
        let keys = Object.keys(fromState.gridParamEnum);
        for (let key of keys) {
            let property = generatePropertyKey(id, key);
            delete store[property];
        }
        return { ...store };
    }),
    on(fromAction.initGrid, (state: {}, { id, option, queryParams }) => {
        let pagination: { page: number; limit: number } = {
            page: queryParams.page || 1,
            limit: queryParams.limit || option.rowsPerPageOptions[0]
        };
        let sort: fromModel.ISortEvent = null;
        if (queryParams.sort) {
            sort = { field: queryParams.sort, direction: queryParams.direction };
        }
        return {
            ...state
            , ...generatePropertyValue(id, fromState.gridParamEnum.startupOption, option)
            , ...generatePropertyValue(id, fromState.gridParamEnum.rowsPerPageOptions, option.rowsPerPageOptions)
            , ...generatePropertyValue(id, fromState.gridParamEnum.pagination, pagination)
            , ...generatePropertyValue(id, fromState.gridParamEnum.sort, sort)
            , ...generatePropertyValue(id, fromState.gridParamEnum.searchKeyword, queryParams.keyword)
            , ...generatePropertyValue(id, fromState.gridParamEnum.enableFilterView, option.enableView)
            , ...generatePropertyValue(id, fromState.gridParamEnum.selectMode, option.selectMode)
        };
    }),
    on(fromAction.refreshGrid, (state: {}, { id, queryParams }) => {
        queryParams = queryParams || {};
        let rowsPerPageOptions = getRowsPerPageOptions(state, id);
        let pagination = getPagination(state, id);
        pagination.page = queryParams.page || 1;
        pagination.limit = queryParams.limit || rowsPerPageOptions[0];
        let sorting: fromModel.ISortEvent = null;
        if (queryParams.sort && queryParams.direction) {
            sorting = { field: queryParams.sort, direction: queryParams.direction };
        }
        return {
            ...state
            , ...generatePropertyValue(id, fromState.gridParamEnum.pagination, pagination)
            , ...generatePropertyValue(id, fromState.gridParamEnum.sort, sorting)
            , ...generatePropertyValue(id, fromState.gridParamEnum.searchKeyword, queryParams.keyword)
        };
    }),
    on(fromAction.changePagination, (state: {}, { id, page, limit }) => {
        return { ...state, ...generatePropertyValue(id, fromState.gridParamEnum.pagination, { page, limit }) };
    }),
    on(fromAction.setViews, (state: {}, { id, views }) => {
        return { ...state, ...generatePropertyValue(id, fromState.gridParamEnum.views, views) };
    }),
    on(fromAction.changeActiveView, (state: {}, { id, viewId, initial }) => {
        let views: Array<fromModel.IFilterView> = getViews(state, id);
        let activeView: fromModel.IFilterView = views.filter(x => x.id === viewId)[0];
        if (!activeView) {
            activeView = views[0];
        }
        let activeColumns = activeView.columns;
        let rowsPerPageOptions = getRowsPerPageOptions(state, id);
        let pagination = getPagination(state, id);
        let sort = getSort(state, id);
        let keyword = getSearchKeyword(state, id);
        return {
            ...state
            , ...generatePropertyValue(id, fromState.gridParamEnum.searchKeyword, initial ? keyword : null)
            , ...generatePropertyValue(id, fromState.gridParamEnum.pagination, initial ? pagination : { page: 1, limit: rowsPerPageOptions[0] })
            , ...generatePropertyValue(id, fromState.gridParamEnum.sort, initial ? sort : null)
            , ...generatePropertyValue(id, fromState.gridParamEnum.activeView, activeView)
            , ...generatePropertyValue(id, fromState.gridParamEnum.activeColumns, activeColumns)
        };
    }),
    on(fromAction.setDatas, (state: {}, { id, datas, count }) => {
        return { ...state, ...generatePropertyValue(id, fromState.gridParamEnum.datas, datas), ...generatePropertyValue(id, fromState.gridParamEnum.dataCount, count) };
    }),
    on(fromAction.freezenColumn, (state: {}, { id, field }) => {
        let activeColumns: Array<fromModel.ITableColumn> = getActiveColumns(state, id);
        let freezenColumns = activeColumns.filter(x => x.frozen);
        let unFreezenColumns = activeColumns.filter(x => !x.frozen && x.field != field);
        let index = activeColumns.findIndex(x => x.field === field);
        let colum = { ...activeColumns[index] };
        colum['frozen'] = true;
        freezenColumns.push(colum);
        return { ...state, ...generatePropertyValue(id, fromState.gridParamEnum.activeColumns, freezenColumns.concat(unFreezenColumns)) };
    }),
    on(fromAction.unFreezenColumn, (state: {}, { id, field }) => {
        let activeColumns: Array<fromModel.ITableColumn> = getActiveColumns(state, id);
        let index = activeColumns.findIndex(x => x.field === field);
        let col = { ...activeColumns[index] };
        col['frozen'] = false;
        activeColumns[index] = col;
        return { ...state, ...generatePropertyValue(id, fromState.gridParamEnum.activeColumns, activeColumns) };
    }),
    on(fromAction.changeColumnWidth, (state: {}, { id, obj }) => {
        let activeColumns: Array<fromModel.ITableColumn> = getActiveColumns(state, id);
        for (let i = 0, len = activeColumns.length; i < len; i++) {
            let col = { ...activeColumns[i] };
            if (obj[col.field]) {
                col.width = obj[col.field];
                activeColumns[i] = col;
            }
        }
        return { ...state, ...generatePropertyValue(id, fromState.gridParamEnum.activeColumns, activeColumns) };
    }),
    on(fromAction.changeAdvanceSettingPanel, (state: {}, { id, panel }) => {
        return { ...state, ...generatePropertyValue(id, fromState.gridParamEnum.advanceSettingPanel, panel) };
    }),
    on(fromAction.toggleColumnVisible, (state: {}, { id, field }) => {
        let activeColumns: Array<fromModel.ITableColumn> = getActiveColumns(state, id);
        let index = activeColumns.findIndex(x => x.field === field);
        let col = { ...activeColumns[index] };
        col.hidden = !col.hidden;
        activeColumns[index] = col;
        return { ...state, ...generatePropertyValue(id, fromState.gridParamEnum.activeColumns, activeColumns) };
    }),
    on(fromAction.changeColumnOrder, (state: {}, { id, columns }) => {
        return { ...state, ...generatePropertyValue(id, fromState.gridParamEnum.activeColumns, columns) };
    }),
    on(fromAction.setSearchKeyword, (state: {}, { id, keyword }) => {
        let pagination = getPagination(state, id);
        pagination.page = 1;
        return {
            ...state
            , ...generatePropertyValue(id, fromState.gridParamEnum.pagination, pagination)
            , ...generatePropertyValue(id, fromState.gridParamEnum.searchKeyword, keyword)
        };
    }),
    on(fromAction.changeSort, (state: {}, { id, sort }) => {
        return {
            ...state
            , ...generatePropertyValue(id, fromState.gridParamEnum.sort, sort)
        };
    }),
    on(fromAction.updateFilters, (state: {}, { id, filters }) => {
        let activeView = getActiveView(state, id);
        activeView.filters = filters;
        return {
            ...state
            , ...generatePropertyValue(id, fromState.gridParamEnum.activeView, activeView)
        };
    }),
    on(fromAction.resetView, (state: {}, { id }) => {
        let rowsPerPageOptions = getRowsPerPageOptions(state, id);
        return {
            ...state
            , ...generatePropertyValue(id, fromState.gridParamEnum.pagination, { page: 1, limit: rowsPerPageOptions[0] })
            , ...generatePropertyValue(id, fromState.gridParamEnum.sort, null)
            , ...generatePropertyValue(id, fromState.gridParamEnum.searchKeyword, null)
        };
    }),
    on(fromAction.saveViewAndLoadData, (state: {}, { id, filters }) => {
        let activeView = getActiveView(state, id);
        activeView.filters = filters;
        return {
            ...state
            , ...generatePropertyValue(id, fromState.gridParamEnum.activeView, activeView)
        };
    })
);

export function reducer(state: any, action: Action) {
    return gridReducer(state, action);
}