import { createReducer, Action, on } from '@ngrx/store';
import * as fromState from './state';
import * as fromAction from './action';

export const gridReducer = createReducer(
    {},
    on(fromAction.initGrid, (state, { id }) => {
        return { ...state, [id]: {} };
    }),
    on(fromAction.changePagination, (state: { [key: string]: fromState.IGridData }, { id, page, limit }) => {
        return { ...state, [id]: { ...state[id], pagination: { page, limit } } };
    }),
    on(fromAction.initViews, (state: { [key: string]: fromState.IGridData }, { id, views }) => {
        let view: { [key: string]: any } = {};
        views.forEach(v => {
            view[v.id] = v;
        });
        return { ...state, [id]: { ...state[id], view } };
    })
);

export function reducer(state: any, action: Action) {
    return gridReducer(state, action);
}