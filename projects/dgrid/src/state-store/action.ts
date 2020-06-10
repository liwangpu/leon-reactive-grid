import { createAction, props } from '@ngrx/store';
import { IGridPagination } from './state';

export class SingleValue<T = any> {
    public constructor(public readonly value: T) { }
    public static from(value: any): SingleValue {
        return new SingleValue(value);
    }
}


export const initializeGridData = createAction('[grid] grid init', props<SingleValue>());

export const changePagination = createAction('[grid] pagination init', props<IGridPagination>());