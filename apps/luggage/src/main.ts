import { HttpClientModule } from '@angular/common/http';
import { enableProdMode, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { APP_ROUTES } from './app/app.routes';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(HttpClientModule),
    provideRouter(APP_ROUTES)
  ],
});
