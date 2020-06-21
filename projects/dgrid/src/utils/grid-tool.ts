import * as queryString from 'query-string';
import { IQueryParam } from '../models';

export function parseUrlQueryParams(url: string): { [key: string]: any } {
    if (!url) { return {}; }
    let urlArr = url.split('?');
    let queryStr = urlArr[1];
    let queryObj = queryString.parse(queryStr);
    if (queryObj.page) {
        queryObj.page = Number(queryObj.page);
    }
    if (queryObj.limit) {
        queryObj.limit = Number(queryObj.limit);
    }
    return queryObj;
}

export function tranferQueryParams(param: IQueryParam): { [key: string]: any } {
    let queryObj: { [key: string]: any } = {};
    queryObj.page = param.pagination.page;
    queryObj.limit = param.pagination.limit;
    if (param.viewId) {
        queryObj.viewId = param.viewId;
    }
    if (param.keyword) {
        queryObj.keyword = param.keyword;
    }
    if (param.sorting && param.sorting.field && param.sorting.direction) {
        queryObj.sort=param.sorting.field;
        queryObj.direction=param.sorting.direction;
    }
    return queryObj;
}