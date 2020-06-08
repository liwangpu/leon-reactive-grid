import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IStudent } from '../models/i-student';
import { map } from 'rxjs/operators';
import { IQueryResult } from '@cxist/xcloud-grid';

@Injectable()
export class StudentService {

    private uri: string = 'http://192.168.69.155:3000/student';
    public constructor(private http: HttpClient) { }

    public query(param?: { [key: string]: any }): Observable<IQueryResult> {
        let limit = param.pagination.limit;
        let page = param.pagination.page;
        return this.http.get<any>(`${this.uri}?_page=${page}&_limit=${limit}`, { observe: 'response' }).pipe(map(res => {
            let total = Number(res.headers.get('X-Total-Count'));
            return { count: total, items: res.body };
        }));
    }

    public create(entity: IStudent): Observable<any> {
        return this.http.post(this.uri, entity);
    }
}
