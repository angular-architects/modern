import { provideState } from '@ngrx/store';
import { flightBookingFeature } from './flight-booking.reducer';
import { provideEffects } from '@ngrx/effects';
import { FlightBookingEffects } from './flight-booking.effects';

export const provideFlightBooking = [
  provideState(flightBookingFeature),
  provideEffects([FlightBookingEffects]),
];
