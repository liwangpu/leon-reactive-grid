import { Component, OnInit } from '@angular/core';
import * as faker from 'faker';
import { forkJoin, concat } from 'rxjs';
import { StudentService } from 'src/app/services/student.service';
import { IStudent } from 'src/app/models/i-student';

@Component({
    selector: 'app-data-faker',
    templateUrl: './data-faker.component.html',
    styleUrls: ['./data-faker.component.scss']
})
export class DataFakerComponent {

    public constructor(private studentSrv: StudentService) { }

    public async generateStudents(): Promise<void> {
        let students: Array<IStudent> = [];
        for (let i: number = 0; i < 100; i++) {
            let s: IStudent = {
                id: `${Date.now()}@${i}@${faker.random.uuid()}`,
                name: faker.name.findName(),
                age: faker.random.number({ min: 5, max: 35 }),
                address: faker.address.streetAddress()
            };
            students.push(s);
        }

        forkJoin(students.map(x => this.studentSrv.create(x))).subscribe(() => {
            alert('学生信息生成完毕!');
        });
    }
}
