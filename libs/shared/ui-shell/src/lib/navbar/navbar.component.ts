import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { map, shareReplay } from 'rxjs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

@Component({
    standalone: true,
    imports: [
        NgIf,
        NgFor,
        AsyncPipe,
        MatToolbarModule,
        MatIconModule
    ],
    selector: 'app-navbar-cmp',
    templateUrl: './navbar.component.html',
})
export class NavbarComponent {
    isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    constructor(
        @Inject(BreakpointObserver) private breakpointObserver: BreakpointObserver) {
    }
}
