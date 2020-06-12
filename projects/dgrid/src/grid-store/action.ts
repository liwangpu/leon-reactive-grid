import { createAction, props } from '@ngrx/store';
import * as fromState from './state';
import * as fromModel from '../models';

export const initGrid = createAction('[DGrid] init grid', props<{ id: string }>());
export const initViews = createAction('[DGrid] change pagination', props<{ id: string; views: Array<fromModel.IFilterView> }>());
export const changePagination = createAction('[DGrid] change pagination', props<{ id: string; page?: number; limit?: number }>());
