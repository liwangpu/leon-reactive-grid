import { createReducer, on } from '@ngrx/store';
import { initializeGridData } from './action';
import { IGridState } from './state';
import { SingleValue } from './single-value';

const _gridReducer = createReducer({},
    on(initializeGridData, (state: IGridState, action: SingleValue) => {
        return state;
    })
);

export function gridReducer(state, action) {
    return _gridReducer(state, action);
}