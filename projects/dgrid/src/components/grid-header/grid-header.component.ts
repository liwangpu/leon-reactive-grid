import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { GridStoreService } from '../../services';
import { SubSink } from 'subsink';

@Component({
    selector: 'dgrid-grid-header',
    templateUrl: './grid-header.component.html',
    styleUrls: ['./grid-header.component.scss']
})
export class GridHeaderComponent implements OnInit, OnDestroy {

    private subs = new SubSink();
    public constructor(
        private storeSrv: GridStoreService
    ) { }

    public ngOnDestroy(): void {

    }

    public ngOnInit(): void {
        this.subs.sink = this.storeSrv.views$.subscribe(views=>{
            console.log(111,views);
        });
    }

}
