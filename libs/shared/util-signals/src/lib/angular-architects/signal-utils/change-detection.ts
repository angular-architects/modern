import { ApplicationRef, ChangeDetectorRef, EnvironmentProviders, ENVIRONMENT_INITIALIZER, inject, makeEnvironmentProviders } from "@angular/core";
import { NavigationEnd, Router } from '@angular/router';
import { filter, tap } from "rxjs";
import { effect, SettableSignal } from "../../angular/core";


export function injectSignalChangeDetection<T extends Record<string, SettableSignal<unknown>>>(
  signals: T): T & { cdRef: ChangeDetectorRef } {
  const cdRef = inject(ChangeDetectorRef);
  effect(() => {
    Object.values(signals).forEach(s => s());
    cdRef.detectChanges();
  })
  return Object.assign({ cdRef }, signals);
}

export function provideRouterChangeDetectionTrigger(): EnvironmentProviders {
  return makeEnvironmentProviders([{
    provide: ENVIRONMENT_INITIALIZER,
    useFactory: (
      router = inject(Router),
      appRef = inject(ApplicationRef)
    ) => () => {
      router.events.pipe(
        filter(e => e instanceof NavigationEnd),
        tap(() => appRef.tick())
      ).subscribe();
    },
    multi: true
  }]);
}
