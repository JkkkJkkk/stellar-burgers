describe('Тесты Конструктора Бургеров - полный цикл', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/ingredients', {
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/auth/user', {
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/orders', {
      statusCode: 200,
      body: {
        success: true,
        name: 'Space флюоресцентный бургер',
        order: {
          number: 76176
        }
      }
    }).as('createOrder');

    cy.setCookie('accessToken', 'Bearer mockAccessToken');
    cy.setCookie('refreshToken', 'mockRefreshToken');

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  it('оформляет заказ и проверяет модальное окно', () => {
    cy.contains('Краторная булка N-200i')
      .parents('li')
      .within(() => {
        cy.contains('Добавить').click();
      });
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
    cy.contains('Оформить заказ').click();
    cy.wait('@createOrder');
    cy.get('.xqsNTMuGR8DdWtMkOGiM').should('exist');
    cy.get('.U070UGjz0x5J0l3NxX3I').should('contain', '76176');
    cy.contains('идентификатор заказа').should('exist');
    cy.contains('Ваш заказ начали готовить').should('exist');
    cy.contains('Дождитесь готовности на орбитальной станции').should('exist');
    cy.get('.Z7mUFPBZScxutAKTLKHN').click();
    cy.get('.xqsNTMuGR8DdWtMkOGiM').should('not.exist');
    cy.get('[class*="constructor-element"]').should('not.exist');
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

