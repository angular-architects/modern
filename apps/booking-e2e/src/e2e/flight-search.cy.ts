it('should search for a flight from Wien to Berlin', () => {
  cy.intercept(
    'https://demo.angulararchitects.io/api/flight?from=Wien&to=Berlin',
    {
      body: [
        { id: 1, from: 'Wien', to: 'Berlin' },
        { id: 2, from: 'Wien', to: 'Berlin' },
        { id: 3, from: 'Wien', to: 'Berlin' },
      ],
    }
  );
  cy.visit('');

  cy.findByRole('link', { name: 'Flights' }).click();
  cy.findByRole('textbox', { name: 'From' }).clear().type('Wien');
  cy.findByRole('textbox', { name: 'To' }).clear().type('Berlin');
  cy.findByRole('button', { name: 'Search' }).click();
  cy.get('[data-testid=flight-card]').should('have.length', 3);
});
