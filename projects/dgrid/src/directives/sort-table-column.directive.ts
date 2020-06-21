import { Directive, ElementRef, EventEmitter, HostBinding, HostListener, Input, Output, Renderer2 } from '@angular/core';
import * as fromModel from '../models';

const ASCENDINGFLAG: string = 'asc';
const DESCENDINGFLAG: string = 'desc';

@Directive({
    selector: '[sortTableColumn]'
})
export class SortTableColumnDirective {

    @HostBinding('attr.sort') public sortIndicator: string;
    @Output()
    public readonly sort: EventEmitter<fromModel.ISortEvent> = new EventEmitter<fromModel.ISortEvent>();
    public columnField: string;
    private _column: fromModel.ITableColumn;
    private direction: string;
    public constructor(
        private el: ElementRef,
        private renderer2: Renderer2
    ) { }

    @Input('sortTableColumn') public set column(col: fromModel.ITableColumn) {
        // console.log('c', col);
        this._column = col;
        if (col && col.sort) {
            this.renderer2.addClass(this.el.nativeElement, 'sortable');
            this.columnField = this.column.sortField ? this.column.sortField : this.column.field;
        }

        if (col['sorting_order']) {
            if (col['sorting_order'] === ASCENDINGFLAG) {
                this.markAsc();
            } else {
                this.markDesc();
            }
        }
    }
    public get column(): fromModel.ITableColumn {
        return this._column;
    }

    @Input()
    public set state(val: fromModel.ISortEvent) {
        if (!val || val.field !== this.column.field) {
            this.clearSort();
            return;
        }
        this.markDirection(val.direction);
    }
    @HostListener('click', ['$event']) public onClick(e: any): void {
        e.stopPropagation();
        if (!this.column || !this.column.sort) { return; }

        if (this.direction === ASCENDINGFLAG) {
            this.markDesc();
        } else if (this.direction === DESCENDINGFLAG) {
            this.clearSort();
        } else {
            this.markAsc();
        }

        this.sort.next({ field: this.columnField, direction: this.direction });
    }

    private clearSort(): void {
        this.direction = '';
        this.sortIndicator = '';
    }

    private markDirection(direction: string): void {
        if (!direction) { return; }
        if (direction === ASCENDINGFLAG) {
            this.markAsc();
            return;
        }

        this.markDesc();
    }

    private markAsc(): void {
        this.direction = ASCENDINGFLAG;
        this.sortIndicator = ASCENDINGFLAG;
    }

    private markDesc(): void {
        this.direction = DESCENDINGFLAG;
        this.sortIndicator = DESCENDINGFLAG;
    }

}
