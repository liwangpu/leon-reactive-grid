import { Component, OnInit } from '@angular/core';
import { DStore } from '../../models';

@Component({
    selector: 'dgrid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss']
})
export class GridComponent implements OnInit {

    constructor(
        private dstore: DStore
    ) { }

    ngOnInit(): void {
    }

}
