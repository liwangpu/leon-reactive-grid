import { Component, OnInit, Input } from '@angular/core';
import * as fromModel from '../../models';

@Component({
    selector: 'dgrid-filter-setting-item',
    templateUrl: './filter-setting-item.component.html',
    styleUrls: ['./filter-setting-item.component.scss']
})
export class FilterSettingItemComponent implements OnInit {


    @Input()
    public column: fromModel.ITableColumn;
    public expand: boolean;
    public constructor() { }

    public ngOnInit(): void {
    }

}
