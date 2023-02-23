import { asyncScheduler, scheduled } from 'rxjs';
import { FlightSearchComponent } from './flight-search.component';
import { provideStore } from '@ngrx/store';
import { HttpClient } from '@angular/common/http';
import { provideFlightBooking } from '@nx-example/booking/domain';
import { provideRouter } from '@angular/router';
import { provideLocationMocks } from '@angular/common/testing';

describe('FlightSearchComponent', () => {
  it('should find 3 flights', async () => {
    const httpClientMock = {
      get: () =>
        scheduled(
          [
            [
              { id: 1, from: 'Wien', to: 'Berlin' },
              { id: 2, from: 'Wien', to: 'Berlin' },
              { id: 3, from: 'Wien', to: 'Berlin' },
            ],
          ],
          asyncScheduler
        ),
    };

    cy.mount(FlightSearchComponent, {
      providers: [
        provideStore(),
        provideFlightBooking,
        provideRouter([]),
        provideLocationMocks(),
        { provide: HttpClient, useValue: httpClientMock },
      ],
    });

    cy.get('[data-testid=inp-from]').clear().type('Wien');
    cy.get('[data-testid=inp-to]').clear().type('Berlin');
    cy.get('[data-testid=btn-search]').click();

    cy.get('[data-testid=flight-card]').should('have.length', 3);
  });
});
