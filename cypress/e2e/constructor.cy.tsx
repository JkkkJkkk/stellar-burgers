/// <reference types="cypress" />

describe('Burger Constructor Tests - с кнопками добавления', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', { fixture: 'ingredients.json' }).as('getIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as('createOrder');

    cy.setCookie('accessToken', 'Bearer mockAccessToken');
    cy.setCookie('refreshToken', 'mockRefreshToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет булку, начинку и соус по нажатию на кнопку "Добавить"', () => {
    cy.contains('Краторная булка N-200i')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.contains('Филе Люминесцентного тетраодонтимформа')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.contains('Соус Spicy-X')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });

    cy.get('[class*=constructor]').should('contain', 'Краторная булка N-200i');

    cy.get('[class*=constructor]').should('contain', 'Филе Люминесцентного тетраодонтимформа');

    cy.get('[class*=constructor]').should('contain', 'Соус Spicy-X');
  });
});
