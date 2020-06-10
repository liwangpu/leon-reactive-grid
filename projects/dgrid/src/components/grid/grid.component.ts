import { Component, OnInit } from '@angular/core';
import { DStore } from '../../models';
import { GridStoreService } from '../../services/grid-store.service';

@Component({
    selector: 'dgrid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    providers: [
        GridStoreService
    ]
})
export class GridComponent implements OnInit {

    public constructor(
        private dstore: DStore,
        private srv:GridStoreService
    ) { }

    public ngOnInit(): void {
    }

}
