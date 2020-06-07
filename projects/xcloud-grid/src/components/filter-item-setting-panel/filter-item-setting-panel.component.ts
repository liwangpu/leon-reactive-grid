import { AfterViewInit, Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DIALOG_DATA, DynamicDialogConfig, DynamicDialogRef } from '@byzan/orion2';
import { SelectItem } from 'primeng/api';
import { delay } from 'rxjs/operators';
import { EQ_OPERATOR, FILTEROPERATORS, GTE_OPERATOR, GT_OPERATOR, LIKE_OPERATOR, LTE_OPERATOR, LT_OPERATOR, NE_OPERATOR } from '../../consts/filter-operators';
import { ColumnTypeEnum } from '../../enums/column-type-enum.enum';
import { IFilter } from '../../models/i-filter';
import { ITableColumn } from '../../models/i-table-column';

@Component({
    selector: 'xcloud-grid-filter-item-setting-panel',
    templateUrl: './filter-item-setting-panel.component.html',
    styleUrls: ['./filter-item-setting-panel.component.scss']
})
export class FilterItemSettingPanelComponent implements OnInit, AfterViewInit {

    public testOp: string = 'eq';
    public fieldType: ColumnTypeEnum;
    public editForm: FormGroup;
    public operators: Array<SelectItem> = FILTEROPERATORS;
    public fields: Array<SelectItem>;
    public values: Array<SelectItem>;
    public constructor(
        public ref: DynamicDialogRef<FilterItemSettingPanelComponent>,
        public config: DynamicDialogConfig,
        private fb: FormBuilder,
        @Optional() @Inject(DIALOG_DATA) private data?: any
    ) {
        this.editForm = this.fb.group({
            field: ['', [Validators.required]],
            operator: ['', [Validators.required]],
            value: []
        });
    }

    public ngOnInit(): void {
        const cols: Array<ITableColumn> = this.data?.columns;
        this.fields = cols.map(x =>
            ({ label: x.name, value: x.field }));

        this.editForm.get('field').valueChanges
            .pipe(delay(150))
            .subscribe(field => {
                let colIndex: number = cols.findIndex(x => x.field === field);
                let col: ITableColumn = cols[colIndex];
                this.fieldType = col.fieldType;

                // tslint:disable-next-line: prefer-switch
                if (col.fieldType === ColumnTypeEnum.Number) {
                    this.settingNumberOperations();
                } else {
                    this.settingStringOperations();
                }
            });

        if (this.data?.filter) {
            this.editForm.patchValue(this.data?.filter);
        } else {
            this.editForm.patchValue({ field: cols[0].field, operator: this.operators[0].value });
        }
    }

    public ngAfterViewInit(): void {
        this.editForm.get('field').valueChanges.subscribe(() => {
            this.editForm.patchValue({ operator: this.operators[0].value, value: '' });
        });

    }

    public save(): void {
        const form: any = this.editForm.value;
        this.ref.close(form);
    }

    private settingStringOperations(): void {
        const opts: Array<SelectItem> = [
            { label: '包含', value: LIKE_OPERATOR },
            { label: '等于', value: EQ_OPERATOR }
        ];
        this.operators = opts;
    }

    private settingNumberOperations(): void {
        const opts: Array<SelectItem> = [
            { label: '等于', value: EQ_OPERATOR },
            { label: '不等于', value: NE_OPERATOR },
            { label: '小于', value: LT_OPERATOR },
            { label: '大于', value: GT_OPERATOR },
            { label: '小于等于', value: LTE_OPERATOR },
            { label: '大于等于', value: GTE_OPERATOR }
        ];
        this.operators = opts;
    }

}
