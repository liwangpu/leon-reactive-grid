import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import * as fromModel from '../../models';
import * as fromOrion from '@byzan/orion2';
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
    public field: string;
    @Input()
    public name: string;
    @Input()
    public set fieldType(type: fromEnum.ColumnTypeEnum) {
        if (type === fromEnum.ColumnTypeEnum.Number) {
            this.settingNumberOperations();
        } else {
            this.settingStringOperations();
        }
    }
    @Input()
    public value: any;
    @Input()
    public operator: string;
    public expand: boolean;
    public operators: Array<fromOrion.SelectItem>;
    public getFilter(): fromModel.IFilter {
        return { field: this.field, operator: this.operator, value: this.value };
    }

    public operatorChange(): void {
        if (!this.operator) {
            this.value = null;
        }
    }

    private settingStringOperations(): void {
        const opts: Array<fromOrion.SelectItem> = [
            { label: '包含', value: fromConst.LIKE_OPERATOR },
            { label: '等于', value: fromConst.EQ_OPERATOR }
        ];
        this.operators = opts;
    }

    private settingNumberOperations(): void {
        const opts: Array<fromOrion.SelectItem> = [
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
