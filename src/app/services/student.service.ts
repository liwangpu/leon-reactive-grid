import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IStudent } from '../models/i-student';
import { map } from 'rxjs/operators';
import * as fromDGrid from 'dgrid';
import * as fromQueryString from 'query-string';

@Injectable()
export class StudentService {

    private uri: string = 'http://127.0.0.1:3000/student';
    public constructor(private http: HttpClient) { }

    public query(param?: fromDGrid.IQueryParam): Observable<fromDGrid.IQueryResult> {
        // console.log('query param', param);
        let limit = param?.pagination?.limit || 20;
        let page = param?.pagination?.page || 1;

        let query: { [key: string]: any } = {
            _page: page,
            _limit: limit
        };

        if (param.keyword) {
            query.q = param.keyword;
        }

        if (param.sorting && param.sorting.field && param.sorting.direction) {
            query._sort = param.sorting.field;
            query._order = param.sorting.direction;
        }

        return this.http.get<any>(`${this.uri}?${fromQueryString.stringify(query)}`, { observe: 'response' }).pipe(map(res => {
            let total = Number(res.headers.get('X-Total-Count'));
            return { count: total, items: res.body };
        }));
    }

    public create(entity: IStudent): Observable<any> {
        return this.http.post(this.uri, entity);
    }
}
