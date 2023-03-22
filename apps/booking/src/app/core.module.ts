import { LayoutModule } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { NavbarComponent, SidebarComponent } from '@nx-example/shared/ui-shell';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    LayoutModule
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    RouterModule
  ]
})
export class CoreModule { }
