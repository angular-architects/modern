import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { CoreModule } from './core.module';

@Component({
  standalone: true,
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
