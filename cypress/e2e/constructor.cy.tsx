/// <reference types="cypress" />

describe('Тесты Конструктора Бургеров - с кнопками добавления', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');
    cy.intercept('GET', '**/auth/user', { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', '**/orders', { fixture: 'order.json' }).as(
      'createOrder'
    );

    cy.setCookie('accessToken', 'Bearer mockAccessToken');
    cy.setCookie('refreshToken', 'mockRefreshToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('добавляет булку, начинку и соус', () => {
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

    cy.get('[class*=constructor]').should(
      'contain',
      'Филе Люминесцентного тетраодонтимформа'
    );

    cy.get('[class*=constructor]').should('contain', 'Соус Spicy-X');
  });
});

describe('Модальное окно ингредиента', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('открывает модальное окно ингредиента при клике', () => {
    cy.get('[href*="/ingredients/"]').first().click();

    cy.get('#modals').should('exist');
    cy.contains('h3', 'Детали ингредиента').should('be.visible');
  });

  it('закрывает модальное окно при клике на кнопку закрытия', () => {
    cy.get('[href*="/ingredients/"]').first().click();
    cy.get('#modals button svg').parent().click();
    cy.get('#modals').should('not.be.visible');
  });

  it('закрывает модальное окно при клике на оверлей', () => {
    cy.get('[href*="/ingredients/"]').first().click();
    cy.get('#modals .RuQycGaRTQNbnIEC5d3Y').click({ force: true });
    cy.get('#modals').should('not.be.visible');
  });
});