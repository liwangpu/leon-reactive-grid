import { createAction, props } from '@ngrx/store';
import * as fromState from './state';
import * as fromModel from '../models';

export const loadData = createAction('[DGrid] load data', props<{ id: string }>());
export const initViews = createAction('[DGrid] init views', props<{ id: string; views: Array<fromModel.IFilterView> }>());
export const changePagination = createAction('[DGrid] change pagination', props<{ id: string; page?: number; limit?: number }>());
export const changeActiveView = createAction('[DGrid] change active view', props<{ id: string, viewId: string }>());
export const setDatas = createAction('[DGrid] set datas', props<{ id: string, datas: Array<any>, count?: number }>());
export const freezenColumn = createAction('[DGrid] freezen column', props<{ id: string, field: string }>());
export const unFreezenColumn = createAction('[DGrid] unfreezen column', props<{ id: string, field: string }>());
export const changeColumnWidth = createAction('[DGrid] change column width', props<{ id: string, obj: { [key: string]: number } }>());
export const changeAdvanceSettingPanel = createAction('[DGrid] open advance setting panel', props<{ id: string, panel?: string }>());
export const toggleColumnVisible = createAction('[DGrid] toggle column visible', props<{ id: string, field?: string }>());
export const changeColumnOrder = createAction('[DGrid] change column order', props<{ id: string, fields?: Array<string> }>());
export const changeViewMode = createAction('[DGrid] change view mode', props<{ id: string, enable: boolean }>());



export const clearStoreData = createAction('[DGrid] clear store data', props<{ id: string }>());
