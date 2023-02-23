# NgRx

## Setup the store

1. Open your `package.json` and find out, that some libraries from the `@ngrx/*` scope have been installed. One of them is `@ngrx/schematics` which extends the CLI by additional commands we are using in the next steps to generate boilerplate code.

2. To setup the `StoreModule` and all the needed imports, switch into the folder `flight-app\src\app` and run the following command.

   `npx ng generate @ngrx/schematics:store AppState --root --statePath=+state --module=app.module.ts --project=flight-app`

3. Open the new `+state` folder and its `index.ts` file.

4. Open the `app.module.ts` file and inspect the current changes. You should find some additional imported modules.

   Check whether all `import` statements in this file work. If not, correct them (sometimes the generated code has some minor issues).

5. Also import the `EffectsModule` into the `AppModule`. Even though we will use it only later, we have to import it now to make the generated code run.

   ```typescript
   import { EffectsModule } from '@ngrx/effects';

   [...]

   imports: [
       [...],
       EffectsModule.forRoot([])
   ];
   ```

## Setup State Management for a Feature Module

1. To setup the `StoreModule` for a feature module, switch into the folder `flight-app\src\app` and use the following command:

   `npx ng generate @ngrx/schematics:feature flight-booking/+state/flight-booking --module=flight-booking/flight-booking.module.ts --creators`

   If you are asked, whether to wire up success and failure functions, answer with "no". We'll do this by hand in this workshop.

   Open the new `+state` folder and inspect the files.

   Inspect all of them and take a look at the `flight-booking.module.ts` where everything is imported.
   See that the `.forFeature` method is called here.

2. Open the file `flight-booking.effects.ts` and remove the body of the class `FlightBookingEffects` as well as all unnecessary imports. Will will come back to this file in a later exercise.

   ```TypeScript
   import {Injectable} from '@angular/core';
   // No other imports, for now

   @Injectable()
   export class FlightBookingEffects {
     // No body, for now
   }
   ```

3. Open the file `flights-booking.reducer.ts`. Extend the interface `State` by a property `flights` with the type `Flight[]`.

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

4. Below, define an empty array as the initial state for the new property `initialState`.
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

5. In the same file, insert an interface `FlightBookingAppState` that represents the root nodes view to our State:

   ```typescript
   export interface FlightBookingAppState {
     flightBooking: State;
   }
   ```

6. Open the file `flight-booking.actions.ts` and setup a `flightsLoaded` action creator.

   <details>
   <summary>Show code</summary>
   <p>
   You can replace the whole file with the following content:

   ```typescript
   [...]

   export const flightsLoaded = createAction(
     '[FlightBooking] FlightsLoaded',
     props<{flights: Flight[]}>()
   );
   ```

   </p>
   </details>

7. Open the file `flight-booking.reducer.ts` and extend the reducer function so that it handles the `flightsLoaded` action.

   <details>
   <summary>Show code</summary>
   <p>

   ```TypeScript
   export const reducer = createReducer(
     initialState,

     on(flightsLoaded, (state, action) => {
       const flights = action.flights;
       return { ...state, flights };
     })
   )
   ```

   </p>
   </details>

8. Open the file `flight-search.component.ts`. Inject the Store into the constructor. Introduce a property `flights$` (`Observable<Flight[]>`) which points to the flights in the store.

   <details>
   <summary>Show code</summary>
   <p>

   ```typescript
   export class FlightSearchComponent implements OnInit {

     [...]

     flights$ = this.store.select(s => s.flightBooking.flights);

     constructor(
       [...]
       private store: Store<FlightBookingAppState>
     ) {}

     [...]
   }
   ```

   </p>
   </details>

9. Modify the component's `search` method so that the loaded flights are send to the store. For this, use the `FlightService`'s `find` method instead of the `load` method and dispatch a `flightsLoaded` action.

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
             this.store.dispatch(flightsLoaded({flights}));
           },
           error: error => {
             console.error('error', error);
           }
         });
   }
   ```

   </p>
   </details>

10. Open the component's template, `flight-search.component.html`, and use the observable `flights$` together with the `async` pipe instead of the array `flights`.

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

11. Test your solution

12. If not already installed, install the Chrome plugin `Redux DevTools` and use it to trace the dispatched actions.

    To install it, use Chrome to navigate to [this page](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd?hl=de).

