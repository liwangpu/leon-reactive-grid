import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Injector, Input, NgZone, OnDestroy, OnInit, Output, Renderer2 } from '@angular/core';
import { Subject } from 'rxjs';
import { SubSink } from 'subsink';
import { LazyService } from '../../utils';
import { take } from 'rxjs/operators';

@Component({
    selector: 'mirror-table-head-cell',
    templateUrl: './table-head-cell.component.html',
    styleUrls: ['./table-head-cell.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableHeadCellComponent implements OnDestroy {

    @Input()
    public title: string;
    @Input()
    public snapline: Element;
    @Output()
    public readonly beforeResize = new EventEmitter<void>();
    @Output()
    public readonly afterResize: EventEmitter<number> = new EventEmitter<number>();
    @LazyService(ElementRef)
    private readonly el: ElementRef;
    @LazyService(NgZone)
    private readonly zone: NgZone;
    @LazyService(Renderer2)
    private readonly renderer2: Renderer2;
    private handlerRelease: Subject<void> = new Subject<void>();
    private resizeEnd: any;
    private size: number = 0;
    private readonly minSize: number = 100;
    public constructor(
        protected injector: Injector
    ) { }


    public ngOnDestroy(): void {
        this.handlerRelease.complete();
        this.handlerRelease.unsubscribe();
    }

    public resizeWidth(evt: Event): void {
        evt.stopPropagation();
        this.beforeResize.emit();
        this.zone.runOutsideAngular(() => {
            console.log('down');

            const cellRect: DOMRect = this.el.nativeElement.getBoundingClientRect();
            const snaplineClientRect: DOMRect = this.snapline.getBoundingClientRect();
            let showSnapline: boolean = false;
            // 用自定义属性记下表格最原始的宽度
            const resize: (e: any) => void = e => {
                e.stopPropagation();
                // console.log('resize');
                // 5补齐padding精度问题
                let thw: number = e.pageX - cellRect.left + 5;
                this.renderer2.setStyle(this.snapline, 'left', `${e.pageX - snaplineClientRect.left}px`);
                if (!showSnapline) {
                    this.renderer2.setStyle(this.snapline, 'opacity', 1);
                    showSnapline = true;
                }
                // 太小了就不调了
                if (Math.abs(thw - cellRect.width) < 4) {
                    thw = cellRect.width;
                }
                if (thw < this.minSize) {
                    thw = this.minSize;
                }
                this.size = thw;
                // console.log('resize', e.pageX, thw);
            };

            window.addEventListener('mousemove', resize);

            const resizeEnd: (e: any) => void = e => {
                e.stopPropagation();
                this.handlerRelease.next();
                window.removeEventListener('mousemove', resize);
                // console.log('end:', this.size);
                this.renderer2.setStyle(this.snapline, 'opacity', 0);
                this.renderer2.setStyle(this.snapline, 'left', 0);

                this.zone.run(() => {
                    this.afterResize.next(this.size);
                });
            };

            this.resizeEnd = resizeEnd;

            window.addEventListener('mouseup', resizeEnd);

            this.handlerRelease.pipe(take(1)).subscribe(() => {
                window.removeEventListener('mouseup', this.resizeEnd);
            });
        });
    }

}
