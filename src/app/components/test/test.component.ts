import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SubSink } from 'subsink';
import * as queryString from 'query-string';
import { Location } from '@angular/common';

@Component({
    selector: 'app-test',
    templateUrl: './test.component.html',
    styleUrls: ['./test.component.scss']
})
export class TestComponent implements OnDestroy {

    public name: string = 'Leon';
    private subs = new SubSink();
    public constructor(
        private acr: ActivatedRoute,
        private router: Router,
        private location: Location
    ) {
        this.subs.sink = this.acr.queryParams.subscribe(q => {
            console.log('acr query', q);
        });
        console.log('ctor');
    }

    public ngOnDestroy(): void {
        this.subs.unsubscribe();
    }

    public goto(): void {
        let url = this.router.url;
        let urlArr = url.split('?');
        let queryStr = urlArr[1];
        let query = queryString.parse(queryStr);
        query.name = this.name;
        // console.log(1, query);
        // this.router.navigate([urlArr[0]], { queryParams: query, replaceUrl: false });
        this.location.go(`${urlArr[0]}?${queryString.stringify(query)}`);

    }

}
