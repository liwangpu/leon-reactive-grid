import { IFilter } from './i-filter';

export interface IQueryParam {
    viewId?: string;
    pagination?: { page?: number; limit?: number };
    sorting?: { field?: string; direction?: string };
    keyword?: string;
    filters?: Array<IFilter>;
    filterLogic?: string;
    extrasUrlQueryParams?: { [key: string]: any };
}
