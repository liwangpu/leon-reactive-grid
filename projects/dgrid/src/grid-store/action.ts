import { createAction, props } from '@ngrx/store';
import * as fromState from './state';
import * as fromModel from '../models';

export const initGrid = createAction('[DGrid] init grid', props<{ id: string }>());
export const initViews = createAction('[DGrid] init views', props<{ id: string; views: Array<fromModel.IFilterView> }>());
export const changePagination = createAction('[DGrid] change pagination', props<{ id: string; page?: number; limit?: number }>());
export const changeActiveView = createAction('[DGrid] change active view', props<{ id: string, viewId: string }>());
export const setDatas = createAction('[DGrid] set datas', props<{ id: string, datas: Array<any> }>());
export const freezenColumn = createAction('[DGrid] freezen column', props<{ id: string, field: string }>());
export const unFreezenColumn = createAction('[DGrid] unfreezen column', props<{ id: string, field: string }>());
export const changeColumnWidth = createAction('[DGrid] change column width', props<{ id: string, obj: { [key: string]: number } }>());
