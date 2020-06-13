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

function getViews(state: {}, id): Array<fromModel.IFilterView> {
    return [...state[generatePropertyKey(id, 'views')]];
}

function getActiveColumns(state: {}, id): Array<fromModel.ITableColumn> {
    return [...state[generatePropertyKey(id, 'activeColumns')]];
}

export const gridReducer = createReducer(
    {},
    on(fromAction.loadData, (state, { id }) => {



        return { ...state };
    }),
    on(fromAction.changePagination, (state: {}, { id, page, limit }) => {
        return { ...state, ...generatePropertyValue(id, 'pagination', { page, limit }) };
    }),
    on(fromAction.initViews, (state: {}, { id, views }) => {
        return { ...state, ...generatePropertyValue(id, 'views', views) };
    }),
    on(fromAction.changeActiveView, (state: {}, { id, viewId }) => {
        let views: Array<fromModel.IFilterView> = getViews(state, id);
        let activeView: fromModel.IFilterView = views.filter(x => x.id === viewId)[0];
        if (!activeView) {
            activeView = views[0];
        }
        let activeColumns = activeView.columns;
        return { ...state, ...generatePropertyValue(id, 'activeView', activeView), ...generatePropertyValue(id, 'activeColumns', activeColumns) };
    }),
    on(fromAction.setDatas, (state: {}, { id, datas }) => {
        return { ...state, ...generatePropertyValue(id, 'datas', datas) };
    }),
    on(fromAction.freezenColumn, (state: {}, { id, field }) => {
        let activeColumns: Array<fromModel.ITableColumn> = getActiveColumns(state, id);
        let index = activeColumns.findIndex(x => x.field === field);
        let colum = { ...activeColumns[index] };
        colum['@frozen'] = true;
        activeColumns[index] = colum;
        return { ...state, ...generatePropertyValue(id, 'activeColumns', activeColumns) };
    }),
    on(fromAction.unFreezenColumn, (state: {}, { id, field }) => {
        let activeColumns: Array<fromModel.ITableColumn> = getActiveColumns(state, id);
        let index = activeColumns.findIndex(x => x.field === field);
        let col = { ...activeColumns[index] };
        col['@frozen'] = false;
        activeColumns[index] = col;
        return { ...state, ...generatePropertyValue(id, 'activeColumns', activeColumns) };
    }),
    on(fromAction.changeColumnWidth, (state: {}, { id, obj }) => {
        let activeColumns: Array<fromModel.ITableColumn> = getActiveColumns(state, id);
        for (let i = 0, len = activeColumns.length; i < len; i++) {
            let col = { ...activeColumns[i] };
            col.width = obj[col.field];
            activeColumns[i] = col;
        }
        return { ...state, ...generatePropertyValue(id, 'activeColumns', activeColumns) };
    })
);

export function reducer(state: any, action: Action) {
    return gridReducer(state, action);
}