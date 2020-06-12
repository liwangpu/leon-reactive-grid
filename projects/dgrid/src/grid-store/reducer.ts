import { createReducer, Action, on } from '@ngrx/store';
import * as fromState from './state';
import * as fromAction from './action';
import { EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export const adapter: EntityAdapter<fromState.IGrid> = createEntityAdapter<fromState.IGrid>();

export const initialState: fromState.GridState = adapter.getInitialState({
});

export const gridReducer = createReducer(
    initialState,
    on(fromAction.addGrid, (state, { grid }) => {
        return adapter.addOne(grid, state)
    }),
);

export function reducer(state: fromState.GridState | undefined, action: Action) {
    return gridReducer(state, action);
}