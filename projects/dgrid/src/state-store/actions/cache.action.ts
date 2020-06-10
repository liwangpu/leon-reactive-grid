import { createAction, props } from '@ngrx/store';


export const initializeGridData = createAction('[grid] data init', props<string>());