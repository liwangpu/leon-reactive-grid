import { Injectable, OnDestroy } from '@angular/core';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MessageFlowEnum } from '../enums/message-flow.enum';

@Injectable()
export class GridMessageFlowService implements OnDestroy {

    private _message: Subject<{ topic: string | MessageFlowEnum; data?: any }> = new ReplaySubject<{ topic: string; data?: any }>(50);
    public get message(): Observable<{ topic: string | MessageFlowEnum; data?: any }> {
        return this._message.asObservable();
    }
    public ngOnDestroy(): void {
        this._message.complete();
        this._message.unsubscribe();
    }

    public publish(topic: string | MessageFlowEnum, data?: any): void {
        if (this._message.isStopped || this._message.closed) {
            return;
        }
        this._message.next({ topic, data });
    }
}
