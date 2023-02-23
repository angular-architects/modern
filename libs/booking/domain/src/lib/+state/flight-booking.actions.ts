import { createActionGroup, props } from '@ngrx/store';
import { Flight } from '@nx-example/booking/domain';

export const flightBookingActions = createActionGroup({
  source: 'FlightBooking',
  events: {
    'Flights Loaded': props<{ flights: Flight[] }>(),
    'Load Flights': props<{ from: string; to: string; urgent: boolean }>(),
  },
});
