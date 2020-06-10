import { createAction, props } from '@ngrx/store';
import { SingleValue } from './single-value';

export const initializeGridData = createAction('[grid] data init', props<SingleValue>());