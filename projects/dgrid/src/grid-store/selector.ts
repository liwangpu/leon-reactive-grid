import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromState from './state';

const selectDGridData = createFeatureSelector<{ [key: string]: fromState.IGridData }>('grid');

export const selectGrid = (id: string) => createSelector(
    selectDGridData,
    state => state[id]
);

export const selectViews = (id: string) => createSelector(
    selectGrid(id),
    (grid: fromState.IGridData) => {
        if (!grid.view) { return []; }
        let views = [];
        let ids = Object.keys(grid.view);
        ids.forEach(k => views.push(grid.view[k]));
        return views;
    }
);