import { createAction, props } from '@ngrx/store';
import * as fromState from './state';
import { Update } from '@ngrx/entity';

export const addGrid = createAction('[DGrid] Add Grid', props<{ grid: fromState.IGridData }>());
export const updateGrid = createAction('[DGrid] Update Grid', props<{ update: Update<fromState.IGridData> }>());

export const initGrid = createAction('[DGrid] init grid', props<{ id: string }>());
export const changePagination = createAction('[DGrid] change pagination', props<{ id: string; page?: number; limit?: number }>());