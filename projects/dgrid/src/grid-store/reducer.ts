import { createReducer, Action, on } from '@ngrx/store';
import * as fromState from './state';
import * as fromAction from './action';

export const gridReducer = createReducer(
    {},
    on(fromAction.initGrid, (state, { id }) => {
        return { ...state, [id]: {} };
    }),
    on(fromAction.changePagination, (state: {}, { id, page, limit }) => {
        return { ...state, [id]: { ...state[id], pagination: { page, limit } } };
    }),
    on(fromAction.initViews, (state: {}, { id, views }) => {
        let view: { [key: string]: any } = {};
        views.forEach(v => {
            view[v.id] = v;
        });
        return { ...state, [id]: { ...state[id], view } };
    }),
    on(fromAction.changeActiveView, (state: {}, { id, viewId }) => {
        // console.log(2,state);
        // let grid=
        return { ...state, [id]: { ...state[id], viewId } };
    })
);

export function reducer(state: any, action: Action) {
    return gridReducer(state, action);
}