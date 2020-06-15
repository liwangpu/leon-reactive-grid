import { Component, OnInit, EventEmitter, Input, Output, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'dgrid-setting-panel-keyword-search',
    templateUrl: './setting-panel-keyword-search.component.html',
    styleUrls: ['./setting-panel-keyword-search.component.scss']
})
export class SettingPanelKeywordSearchComponent implements OnInit, OnDestroy {

    @Input()
    public keyword: string;
    @Output()
    public readonly keywordChange: EventEmitter<string> = new EventEmitter<string>();
    public _keywordChange = new Subject<string>();
    public constructor() { }

    public ngOnDestroy(): void {
        this._keywordChange.complete();
        this._keywordChange.unsubscribe();
    }

    public ngOnInit(): void {
        this._keywordChange.pipe(debounceTime(300)).subscribe(kw => {
            this.keywordChange.next(kw);
        });
    }

}
