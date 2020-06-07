import { IFilter } from './i-filter';
import { ITableColumn } from './i-table-column';

export const FILTERLOGICAND: string = '@and';
export const FILTERLOGICOR: string = '@or';

export interface IFilterView {
    id: string;
    name: string;
    filters?: Array<IFilter>;
    filterLogic?: string;
    columns?: Array<ITableColumn>;
}
