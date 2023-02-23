import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FlightService } from "@nx-example/booking/domain";

import { FlightCardComponent } from "@nx-example/booking/ui-common";
import { CityValidator } from "@nx-example/shared/util-common";

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    FlightCardComponent,
    CityValidator,
  ],
  providers: [
  ],
  selector: 'flight-search',
  templateUrl: './flight-search.component.html'
})
export class FlightSearchComponent {

  from = 'Berlin';
  to = 'London';
  urgent = false;

  flightService = inject(FlightService)

get flights() {
  return this.flightService.flights;
}

  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  search(): void {
    if (!this.from || !this.to) return;

    this.flightService.load(this.from, this.to, this.urgent)
  }

  delay(): void {
    this.flightService.delay();
  }

}

