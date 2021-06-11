import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
    selector: 'mirror-grid',
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridComponent implements OnInit {

    public constructor() { }

    public ngOnInit(): void {
    }

}
