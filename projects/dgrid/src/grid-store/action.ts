import { createAction, props } from '@ngrx/store';
import * as fromState from './state';


export const initGrid = createAction('[DGrid] init grid', props<{ id: string }>());
export const setPagination = createAction('[DGrid] change pagination', props<{ id: string; page?: number; limit?: number }>());
// export const 