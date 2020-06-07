import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    public constructor(
        private router: Router
    ) {
        // this.router.events.pipe(filter(evt => evt instanceof NavigationEnd)).subscribe(res => {
        //     console.info('url info:', res);
        // });
    }

}
