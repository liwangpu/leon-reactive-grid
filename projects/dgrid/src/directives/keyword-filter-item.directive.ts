import { Directive, Input, HostBinding } from '@angular/core';

@Directive({
    selector: '[keywordFilterItem]'
})
export class KeywordFilterItemDirective {

    @HostBinding('class.hidden')
    public hidden: boolean;
    @Input('keywordFilterItem')
    public name: string;
    @Input()
    public set keyword(kw: string) {
        // console.log('get keyword', kw);
        if (!kw) {
            this.hidden = false;
            return;
        }

        this.hidden = this.name && this.name.includes(kw) ? false : true;
    }
    public constructor() { }

}
