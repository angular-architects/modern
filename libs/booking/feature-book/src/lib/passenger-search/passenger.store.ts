import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { concatMap, map, Observable, switchMap, tap } from 'rxjs';
import { Passenger } from '@nx-example/booking/domain';
import { concatLatestFrom } from '@ngrx/effects';

type PassengerState = {
  query: string;
  passengers: Passenger[];
};

@Injectable()
export class PassengerStore extends ComponentStore<PassengerState> {
  httpClient = inject(HttpClient);

  constructor() {
    super({ query: '', passengers: [] });
  }

  readonly passengers$ = this.select((state) => state.passengers);
  readonly query$ = this.select((state) => state.query);

  search = this.effect((search$: Observable<string>) =>
    search$.pipe(
      switchMap((query) =>
        this.httpClient
          .get<Passenger[]>(`http://www.angular.at/api/passenger?name=${query}`)
          .pipe(map((passengers) => ({ passengers, query })))
      ),
      tap(({ passengers }) =>
        passengers.sort((p1, p2) => (p1.id > p2.id ? 1 : -1))
      ),
      tapResponse((state) => this.patchState(state), console.error)
    )
  );

  refresh = this.effect((i$: Observable<void>) => {
    return i$.pipe(
      concatLatestFrom(() => this.query$),
      map((data) => data[1]),
      tap((query: string) => this.search(query))
    );
  });

  #update = this.effect((passenger$: Observable<Passenger>) => {
    return passenger$.pipe(
      concatMap((passenger) =>
        this.httpClient.post('http://www.angular.at/api/passenger', {
          ...passenger,
        })
      ),
      tapResponse(() => this.refresh(), console.error)
    );
  });

  downgrade(passenger: Passenger) {
    if (passenger.passengerStatus === 'C') {
      return;
    }

    this.#update({
      ...passenger,
      passengerStatus: passenger.passengerStatus === 'A' ? 'B' : 'C',
    });
  }

  upgrade(passenger: Passenger) {
    if (passenger.passengerStatus === 'A') {
      return;
    }

    this.#update({
      ...passenger,
      passengerStatus: passenger.passengerStatus === 'C' ? 'B' : 'A',
    });
  }
}
