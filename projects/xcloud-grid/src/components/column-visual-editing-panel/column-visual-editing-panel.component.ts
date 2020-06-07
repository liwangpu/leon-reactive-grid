import { Component, Inject } from '@angular/core';
import { DIALOG_DATA, DynamicDialogRef } from '@byzan/orion2';
import { ITableColumn } from '../../models/i-table-column';
import { ITransferItem } from '../transfer/transfer.component';

@Component({
    selector: 'xcloud-grid-column-visual-editing-panel',
    templateUrl: './column-visual-editing-panel.component.html',
    styleUrls: ['./column-visual-editing-panel.component.scss']
})
export class ColumnVisualEditingPanelComponent {

    public fields: Array<{ value?: any; lable: string }>;
    public invisibaleFields: Array<string>;
    public fieldSettings: [Array<ITransferItem>, Array<ITransferItem>];
    public canSave: boolean = false;
    public constructor(
        public ref: DynamicDialogRef<ColumnVisualEditingPanelComponent>,
        @Inject(DIALOG_DATA) private data?: any
    ) {
        if (this.data?.columns?.length) {
            this.fields = this.data.columns.map(x => ({ value: x.field, lable: x.name }));
            this.invisibaleFields = this.data.columns.filter(x => x['_invisibale']).map(x => x.field);
        }
    }

    public onFieldChange(res: [Array<ITransferItem>, Array<ITransferItem>]): void {
        this.fieldSettings = res;
        this.canSave = res[1].length > 0;
    }

    public save(): void {
        this.ref.close(this.fieldSettings);
    }

}
