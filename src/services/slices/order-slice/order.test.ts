import { getOrderByNumber } from './order';
import orderReducer from './order';
import { TOrder } from '@utils-types';

const testOrder: TOrder = {
  _id: '6624d9a8c3f7b9001cfa1234',
  status: 'done',
  name: 'Флюоресцентный космический бургер',
  createdAt: '2024-05-20T14:30:00.000Z',
  updatedAt: '2024-05-20T15:45:00.000Z',
  number: 25678,
  ingredients: [
    '643d69a5c3f7b9001cfa093c',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093c'
  ]
};

const testOrderWithEmptyIngredients: TOrder = {
  _id: '6624d9a8c3f7b9001cfa5678',
  status: 'created',
  name: 'Лунный фаллениум бургер',
  createdAt: '2024-05-21T09:15:00.000Z',
  updatedAt: '2024-05-21T09:15:00.000Z',
  number: 25679,
  ingredients: []
};

const initialState = {
  orders: [],
  getOrderByNumberResponse: null,
  error: null,
  request: false,
  responseOrder: null
};

describe('Редьюсер заказа', () => {
  it('обрабатывает действие "ожидание"', () => {
    const action = { type: getOrderByNumber.pending.type };
    const state = orderReducer(
      { ...initialState, error: 'предыдущая ошибка' },
      action
    );

    expect(state).toEqual({
      ...initialState,
      request: true,
      error: null
    });
  });

  it('обрабатывает действие "успех" с нормальным заказом', () => {
    const action = {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: [testOrder] }
    };

    const state = orderReducer({ ...initialState, request: true }, action);

    expect(state).toEqual({
      ...initialState,
      request: false,
      error: null,
      orders: { orders: [testOrder] },
      getOrderByNumberResponse: undefined,
      responseOrder: undefined
    });
  });

  it('обрабатывает действие "успех" с заказом без ингредиентов', () => {
    const action = {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: [testOrderWithEmptyIngredients] }
    };

    const state = orderReducer({ ...initialState, request: true }, action);

    expect(state).toEqual({
      ...initialState,
      request: false,
      error: null,
      orders: { orders: [testOrderWithEmptyIngredients] },
      getOrderByNumberResponse: undefined,
      responseOrder: undefined
    });
  });

  it('обрабатывает действие "ошибка"', () => {
    const errorMessage = 'Ошибка при получении заказа';

    const action = {
      type: getOrderByNumber.rejected.type,
      payload: errorMessage
    };

    const state = orderReducer({ ...initialState, request: true }, action);

    expect(state).toEqual({
      ...initialState,
      request: false,
      error: errorMessage
    });
  });

  it('обрабатывает действие "ошибка" без сообщения об ошибке', () => {
    const action = {
      type: getOrderByNumber.rejected.type
    };

    const state = orderReducer({ ...initialState, request: true }, action);

    expect(state).toEqual({
      ...initialState,
      request: false,
      error: undefined
    });
  });

  it('возвращает исходное состояние для неизвестного действия', () => {
    const action = { type: 'UNKNOWN_ACTION' };
    const state = orderReducer(initialState, action);

    expect(state).toEqual(initialState);
  });

  it('сохраняет предыдущие заказы при новом успешном запросе', () => {
    const firstAction = {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: [testOrder] }
    };

    const firstState = orderReducer(initialState, firstAction);

    const secondAction = {
      type: getOrderByNumber.fulfilled.type,
      payload: { orders: [testOrderWithEmptyIngredients] }
    };

    const secondState = orderReducer(firstState, secondAction);

    expect(secondState).toEqual({
      ...initialState,
      request: false,
      error: null,
      orders: { orders: [testOrderWithEmptyIngredients] },
      getOrderByNumberResponse: undefined,
      responseOrder: undefined
    });
  });

  it('обрабатывает несколько последовательных pending действий', () => {
    const firstAction = { type: getOrderByNumber.pending.type };
    const firstState = orderReducer(initialState, firstAction);

    const secondAction = { type: getOrderByNumber.pending.type };
    const secondState = orderReducer(firstState, secondAction);

    expect(secondState).toEqual({
      ...initialState,
      request: true,
      error: null
    });
  });
});
