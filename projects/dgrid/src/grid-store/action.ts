import { createAction, props } from '@ngrx/store';
import * as fromState from './state';
import { Update } from '@ngrx/entity';

export const addGrid = createAction('[DGrid] Add Grid', props<{ grid: fromState.IGrid }>());
export const updateGrid = createAction('[DGrid] Update Grid', props<{ update: Update<fromState.IGrid> }>());