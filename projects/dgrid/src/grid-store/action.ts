import { createAction, props } from '@ngrx/store';
import * as fromState from './state';

export const addGrid = createAction('[DGrid] Add Grid', props<{ grid: fromState.IGrid }>());