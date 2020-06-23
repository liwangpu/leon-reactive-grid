import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
    selector: '[dynamicStyleWidth]'
})
export class DynamicStyleWidthDirective {

    @HostBinding('style.flex')
    public flex: string;
    @HostBinding('style.width')
    public width: string;
    @Input()
    public columnType: 'frozen' | 'unfrozen';
    @Input('dynamicStyleWidth')
    public set dynamicStyleWidth(val: number) {
        if (this.columnType === 'frozen') {
            this.width = val > 0 ? `${val}px` : '100px';
            this.flex = 'none';
            return;
        }

        this.width = 'auto';
        this.flex = val > 0 ? `1 0 ${val}px` : '1 0 100px';
    }

}
