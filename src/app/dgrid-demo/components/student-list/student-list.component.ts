import { Component, OnInit, forwardRef } from '@angular/core';
import { DStore } from 'dgrid';

@Component({
    selector: 'app-student-list',
    templateUrl: './student-list.component.html',
    styleUrls: ['./student-list.component.scss'],
    providers: [
        {
            provide: DStore,
            useExisting: forwardRef(() => StudentListComponent)
        }
    ]
})
export class StudentListComponent implements OnInit {

    constructor() { }

    ngOnInit(): void {
    }

}
