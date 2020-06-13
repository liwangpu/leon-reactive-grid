import { Directive, HostListener, Input, Output, EventEmitter } from '@angular/core';
import { ITableColumn } from '../models/i-table-column';

@Directive({
    selector: '[tableStateRow]'
})
export class TableStateRowDirective {

    @Output()
    public onHover: EventEmitter<number> = new EventEmitter<number>();
    @Input('tableStateRow') public rowIndex: number;
    @Input() public enableRowState: boolean;
    @HostListener('mouseenter', ['$event']) public onMouseEnter(e: any): void {
        e.stopPropagation();
        // if (!this.enableRowState) {
        //     this.row['_active'] = false;
        //     return;
        // }
        // this.row['_active'] = true;
        // console.log('in', this.rowIndex);
        this.onHover.next(this.rowIndex);
    }
    @HostListener('mouseleave', ['$event']) public onMouseLeave(e: any): void {
        e.stopPropagation();
        // this.row['_active'] = false;
    }

}
