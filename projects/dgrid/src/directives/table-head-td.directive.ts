import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[mirrorTableHeadTd]'
})
export class TableHeadTdDirective {

    @Input('mirrorTableHeadTd')
    public field: string;
    public constructor(
        public el: ElementRef
    ) { }

}


