import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { CoreModule } from './core.module';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { NavbarComponent, SidebarComponent } from '@nx-example/shared/ui-shell';
import { RouterOutlet } from '@angular/router';

@Component({
  standalone: true,
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,

    NavbarComponent,
    SidebarComponent,

    RouterOutlet,
  ],
  selector: 'app-root',
  imports: [CoreModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  constructor(
    @Inject(BreakpointObserver) private breakpointObserver: BreakpointObserver) {
  }

}
