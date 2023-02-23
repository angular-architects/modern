# NgRx

## Setup State Management for a Feature Module

1. To setup a feature state, switch into the folder `libs\booking\domain\src\lib`. Create a new folder called `+state`. This is the directory, where all NgRx-related files will be located.

2. Create the file `flights-booking.reducer.ts`. Create the an interface `State` with property `flights` of type `Flight[]`.

   <details>
   <summary>Show code</summary>
   <p>

   ```typescript
   export interface State {
     flights: Flight[];
   }
   ```

   </p>
   </details>

3. Below, define an empty array as the initial state for the new property `initialState`.
   <details>
   <summary>Show code</summary>
   <p>

   ```typescript
   export const initialState: State = {
     flights: [],
   };
   ```

   </p>
   </details>

4. Create the file `flight-booking.actions.ts` and setup a `flightsLoaded` action creator.

      <details>
      <summary>Show code</summary>
      <p>
      You can replace the whole file with the following content:

   ```typescript
   export const flightBookingActions = createActionGroup({
     source: 'FlightBooking',
     events: {
       'Flights Loaded': props<{ flights: Flight[] }>(),
     },
   });
   ```

      </p>
      </details>

5. Open the file `flight-booking.reducer.ts` and create the reducer function so that it handles the `flightsLoaded` action.

      <details>
      <summary>Show code</summary>
      <p>

   ```typescript
   export const flightBookingFeature = createFeature({
     name: 'flightBooking',
     reducer: createReducer(
       initialState,
       on(flightBookingActions.flightsLoaded, (state, action) => {
         const flights = action.flights;
         return { ...state, flights };
       })
     ),
   });
   ```

      </p>
      </details>

6. Provide the feature state

Further more, in the `+state` directory, create a new file `flight-booking.provider.ts`. It should export the provide functions for the feature state.

```typescript
import { provideState } from '@ngrx/store';
import { flightBookingFeature } from './flight-booking.reducer';

export const provideFlightBooking = [provideState(flightBookingFeature)];
```

In the `index.ts` of the library, export the `flightBookingActions` from the actions file, and the `flightBookingProvider`.

Switch to the library `booking-feature-book`. Open the `flight-booking.routes.ts` and add the `provides` property to the top path. Insert the `flightBookingProvider`:

```typescript
export const FLIGHT_BOOKING_ROUTES: Routes = [
  {
    path: '',
    component: FlightBookingComponent,
    providers: [provideFlightBooking], // <-- add that one
    children: [
      // ...
    ],
  },
];
```

7. Open the file `flight-search.component.ts`. Inject the Store into the constructor. Introduce a property `flights$` (`Observable<Flight[]>`) which points to the flights in the store.

      <details>
      <summary>Show code</summary>
      <p>

   ```typescript
   export class FlightSearchComponent implements OnInit {
     // ...

     store = inject(Store);
     flights$ = this.store.select((s) => s.flightBooking.flights);

     // ...
   }
   ```

</p>
</details>

8. Modify the component's `search` method so that the loaded flights are send to the store. For this, use the `FlightService`'s `find` method instead of the `load` method and dispatch a `flightsLoaded` action.

<details>
<summary>Show code</summary>
<p>

```TypeScript
search(): void {
if (!this.from || !this.to) return;

// old:
// this.flightService.load(...)

// new:
this.flightService
   .find(this.from, this.to, this.urgent)
   .subscribe({
     next: flights => {
       this.store.dispatch(flightBookingActions.flightsLoaded({flights}));
     },
     error: error => {
       console.error('error', error);
     }
   });
}
```

   </p>
   </details>

9. Open the component's template, `flight-search.component.html`, and use the observable `flights$` together with the `async` pipe instead of the array `flights`.

   <details>
   <summary>Show code</summary>
   <p>

```html
<div *ngFor="let f of flights$ | async">
  <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3">
    <flight-card [...]></flight-card>
  </div>
</div>
```

   </p>
   </details>

10. Test your solution

11. If not already installed, install the Chrome plugin `Redux DevTools` and use it to trace the dispatched actions.

    To install it, use Chrome to navigate to [this page](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=de).
