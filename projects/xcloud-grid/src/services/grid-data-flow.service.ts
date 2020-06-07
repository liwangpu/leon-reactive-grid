import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { DataFlowTopicEnum } from '../enums/data-flow-topic.enum';

@Injectable()
export class GridDataFlowService implements OnDestroy  {
    private _message: Subject<{ topic: string | DataFlowTopicEnum; data?: any }> = new ReplaySubject<{ topic: string; data?: any }>(50);

    public get message(): Observable<{ topic: string | DataFlowTopicEnum; data?: any }> {
        return this._message.asObservable();
    }

    public ngOnDestroy(): void {
        this._message.complete();
        this._message.unsubscribe();
    }

    public publish(topic: string | DataFlowTopicEnum, data?: any): void {
        if (this._message.isStopped || this._message.closed) {
            return;
        }
        this._message.next({ topic, data });
    }
}
