import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
    selector: '[syncScrollArea]'
})
export class SyncScrollAreaDirective {

    @Input('syncScrollArea')
    public type: string;
    public constructor(public template: TemplateRef<any>) { }

}
