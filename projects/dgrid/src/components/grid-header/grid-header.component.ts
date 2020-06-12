import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridStoreService } from '../../services';

@Component({
    selector: 'dgrid-grid-header',
    templateUrl: './grid-header.component.html',
    styleUrls: ['./grid-header.component.scss']
})
export class GridHeaderComponent implements OnInit {

    public constructor(
        private storeSrv: GridStoreService
    ) { }

    ngOnInit(): void {
    }

}
