import { createReducer, on } from '@ngrx/store';
import { initializeGridData, SingleValue, changePagination } from './action';
import { IGridState, IGridPagination, IGridData } from './state';

const _gridReducer = createReducer({},
    on(initializeGridData, (state: { [key: string]: IGridData }, action: SingleValue<string>) => {
        return { ...state, [action.value]: {} };
    }),
    on(changePagination, (state: { [key: string]: IGridData }, action: IGridPagination) => {
        let grid = state[action.id];
        return { ...state, [action.id]: { ...grid, pagination: { page: action.page, limit: action.limit } } };
    })
);

export function gridReducer(state, action) {
    return _gridReducer(state, action);
}