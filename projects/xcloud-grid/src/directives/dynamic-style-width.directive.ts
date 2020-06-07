import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[dynamicStyleWidth]'
})
export class DynamicStyleWidthDirective {

    @HostBinding('style.width')
    public width: string;
    @Input('dynamicStyleWidth')
    public set dynamicStyleWidth(val: number) {
        this.width = val > 0 ? `${val}px` : 'auto';
    }

}
