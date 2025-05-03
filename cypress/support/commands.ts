declare global {
  namespace Cypress {
    interface Chainable {
      mockAuth(): void;
      dragTo(targetSelector: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}

Cypress.Commands.add('mockAuth', () => {
  cy.fixture('auth.json').then(auth => {
    cy.intercept('GET', '/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: { email: "joani2018@yandex.ru", name: "jkkk" }
      },
      headers: { Authorization: auth.token }
    }).as('getUser');
  });

  cy.intercept('GET', '/api/ingredients', {
    fixture: 'ingredients.json'
  }).as('getIngredients');

  cy.intercept('POST', '/api/orders', {
    fixture: 'order.json'
  }).as('createOrder');
});

export {};