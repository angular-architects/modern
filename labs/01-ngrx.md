- [1. Setup State Management for a Feature Module](#1-setup-state-management-for-a-feature-module)
- [2. Consume inside of the Component](#2-consume-inside-of-the-component)
- [3. Creating an Effect](#3-creating-an-effect)
- [4. Bonus: Error Handling](#4-bonus-error-handling)

# 1. Setup State Management for a Feature Module

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

# 2. Consume inside of the Component

1. Open the file `flight-search.component.ts`. Inject the Store into the constructor. Introduce a property `flights$` (`Observable<Flight[]>`) which points to the flights in the store.

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

2. Modify the component's `search` method so that the loaded flights are send to the store. For this, use the `FlightService`'s `find` method instead of the `load` method and dispatch a `flightsLoaded` action.

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

3. Open the component's template, `flight-search.component.html`, and use the observable `flights$` together with the `async` pipe instead of the array `flights`.

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

4. Test your solution

5. If not already installed, install the Chrome plugin `Redux DevTools` and use it to trace the dispatched actions.

   To install it, use Chrome to navigate to [this page](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=de).

# 3. Creating an Effect

1.  Open your `flight-booking.actions.ts` file and append a `loadFlights` action with properties `from`, `to`, and `urgent`.

       <details>
       <summary>Show code</summary>
       <p>

    ```typescript
    export const flightBookingActions = createActionGroup({
      source: 'FlightBooking',
      events: {
        'Flights Loaded': props<{ flights: Flight[] }>(),
        'Load Flights': props<{ from: string; to: string; urgent: boolean }>(), // <-- this is new
      },
    });
    ```

       </p>
       </details>

2.  Create the file `flight-booking.effects.ts` and add an effect that takes a `FlightsLoadAction`, loads the requested flights and returns a `FlightsLoadedAction`.

<details>
<summary>Show code</summary>
<p>

    ```typescript
    @Injectable()
    export class FlightBookingEffects {
      actions$ = inject(Actions);
      flightService = inject(FlightService);

      loadFlights$ = createEffect(() => {
        return this.actions$.pipe(
          ofType(flightBookingActions.loadFlights),
          switchMap((a) => this.flightService.find(a.from, a.to, a.urgent)),
          map((flights) => flightBookingActions.flightsLoaded({ flights }))
        );
      });
    }
    ```

</p>
</details>

**Tipp:** Import the `Actions` type from the module `@ngrx/effects`:

`import {Actions} from '@ngrx/effects';`

3. In order to provide the effects, you have to add them to the `provideFlightBooking` array:

<details>
<summary>Show code</summary>
<p>

</p>
</details>

4. Open the file `flight-search.component.ts`. Change the `search` method so that it just dispatches a `loadFlights` action.

<details>
<summary>Show code</summary>
<p>

```typescript
class FlightSearchComponent {
  // ...

  search(): void {
    if (!this.from || !this.to) return;

    // New:
    this.store.dispatch(
      flightBookingActions.loadFlights({
        from: this.from,
        to: this.to,
        urgent: this.urgent,
      })
    );

    // ...
  }
}
```

   </p>
   </details>

5. Test the application.

6. Use the `Redux DevTools` Chrome plugin to find out which actions are dispatched.

# 4. Bonus: Error Handling

1. Open your `flight-booking.actions.ts` file and add an LoadFlightsError Action without a payload:

```typescript
export const loadFlightsError = createAction(
  '[FlightBooking] Load Flights Error'
);
```

2. In your `flight-booking.effects.ts`, add an error handler to the switchMap. This error handler should return the `loadFlightError` action.

   <details>
   <summary>Show code</summary>
   <p>

   ```typescript
   loadFlightBookings$ = createEffect(() =>
     this.actions$.pipe(
       ofType(loadFlights),
       switchMap((a) =>
         this.flightService.find(a.from, a.to, a.urgent).pipe(
           map((flights) => flightsLoaded({ flights })),
           catchError((err) => of(loadFlightsError()))
         )
       )
     )
   );
   ```

   </p>  
   </details>

3. Test your solution. You can simulate an error with the Browser's dev tools by activating offline module in the `Network` tab.
4. Use the Redux Dev Tools to make sure, that the `loadFlightsError` action is send to the store.
