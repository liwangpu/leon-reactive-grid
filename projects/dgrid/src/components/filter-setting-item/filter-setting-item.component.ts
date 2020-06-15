import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import * as fromModel from '../../models';
import { SelectItem } from '@byzan/orion2';
import * as fromConst from '../../consts';
import * as  fromEnum from '../../enums';

@Component({
    selector: 'dgrid-filter-setting-item',
    templateUrl: './filter-setting-item.component.html',
    styleUrls: ['./filter-setting-item.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterSettingItemComponent {

    @Input()
    public set column(col: fromModel.ITableColumn) {
        this._column = col;
        if (col.fieldType === fromEnum.ColumnTypeEnum.Number) {
            this.settingNumberOperations();
        } else {
            this.settingStringOperations();
        }
    }
    public get column(): fromModel.ITableColumn {
        return this._column;
    }
    public expand: boolean;
    public operator: string;
    public operators: Array<SelectItem>
    private _column: fromModel.ITableColumn;

    private settingStringOperations(): void {
        const opts: Array<SelectItem> = [
            { label: '包含', value: fromConst.LIKE_OPERATOR },
            { label: '等于', value: fromConst.EQ_OPERATOR }
        ];
        this.operators = opts;
    }

    private settingNumberOperations(): void {
        const opts: Array<SelectItem> = [
            { label: '等于', value: fromConst.EQ_OPERATOR },
            { label: '不等于', value: fromConst.NE_OPERATOR },
            { label: '小于', value: fromConst.LT_OPERATOR },
            { label: '大于', value: fromConst.GT_OPERATOR },
            { label: '小于等于', value: fromConst.LTE_OPERATOR },
            { label: '大于等于', value: fromConst.GTE_OPERATOR }
        ];
        this.operators = opts;
    }

}
