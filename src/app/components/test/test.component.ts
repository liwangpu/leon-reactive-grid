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
export class TestComponent {

    contents = [];
    public constructor(
    ) {

    }

    public addContent(): void {
        for (let idx = 50; idx >= 0; idx--) {
            this.contents.push(Date.now().toString());
        }
    }

}
