import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { BookingSlice, delayFlight, Flight, loadFlights, selectFlights } from "@nx-example/booking/domain";
import { fromObservable, injectSignalChangeDetection, signal } from '@nx-example/shared/util-signals';

import { take } from "rxjs";
import { SettableSignal } from './../../../../../shared/util-signals/src/lib/angular/core/signals/src/signal';

import { FlightCardComponent, FlightFilterComponent } from '@nx-example/booking/ui-common';
import { CityValidator } from '@nx-example/shared/util-common';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    FlightFilterComponent,
    CityValidator,
  ],
  providers: [
  ],
  selector: 'flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {
  store = inject(Store<BookingSlice>);

  state = injectSignalChangeDetection({
    from: signal('Berlin'),
    to: signal('London'),
    urgent: signal(false),
    basket: signal<Record<number, boolean>>({
      3: true,
      5: true
    }),
    flights: fromObservable(this.store.select(selectFlights)) as SettableSignal<Flight[]>
  });

  search(): void {
    if (!this.state.from() || !this.state.to()) return;

    this.store.dispatch(loadFlights({
      from: this.state.from(),
      to: this.state.to()

    }));
  }

  delay(): void {
    this.store.dispatch(delayFlight({
      id: this.state.flights()[0].id
    }));
  }

  updateBasket(id: number, selected: boolean): void {
    this.state.basket.mutate(basket => basket[id] = selected);
  }

}
