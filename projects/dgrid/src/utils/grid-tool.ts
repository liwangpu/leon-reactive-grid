import * as queryString from 'query-string';

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