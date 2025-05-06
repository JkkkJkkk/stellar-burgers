import { feedReducer, getFeeds, initialState } from './feed';
import { IFeedsResponse } from './type';

const defaultErrorMessage = 'Network Error';

const testOrders: IFeedsResponse = {
  orders: [
    {
      _id: '6624d9a8c3f7b9001cfa1234',
      number: 34567,
      status: 'done',
      name: 'Флюоресцентный бургер',
      ingredients: [
        '643d69a5c3f7b9001cfa093c',
        '643d69a5c3f7b9001cfa0941',
        '643d69a5c3f7b9001cfa0943'
      ],
      createdAt: '2024-04-22T12:30:45.000Z',
      updatedAt: '2024-04-22T12:45:30.000Z'
    },
    {
      _id: '6624d9a8c3f7b9001cfa5678',
      number: 34568,
      status: 'pending',
      name: 'Космический люминесцентный бургер',
      ingredients: [
        '643d69a5c3f7b9001cfa093d',
        '643d69a5c3f7b9001cfa0942',
        '643d69a5c3f7b9001cfa0944',
        '643d69a5c3f7b9001cfa0943'
      ],
      createdAt: '2024-04-22T13:15:20.000Z',
      updatedAt: '2024-04-22T13:15:20.000Z'
    },
    {
      _id: '6624d9a8c3f7b9001cfa9abc',
      number: 34569,
      status: 'created',
      name: 'Астероидный традиционный бургер',
      ingredients: [
        '643d69a5c3f7b9001cfa093e',
        '643d69a5c3f7b9001cfa0945',
        '643d69a5c3f7b9001cfa0946'
      ],
      createdAt: '2024-04-22T14:05:10.000Z',
      updatedAt: '2024-04-22T14:10:15.000Z'
    }
  ],
  total: 1250,
  totalToday: 42
};

describe('feed reducer', () => {
  let action;
  let state;

  it('проверка вызова экшена request', () => {
    action = { type: getFeeds.pending.type };
    state = feedReducer(
      { ...initialState, error: 'Previous error' },
      action
    );

    const expectedState = {
      ...initialState,
      isLoading: true,
      error: null
    };

    expect(state).toEqual(expectedState);
  });

  it('проверка вызова экшена success', () => {
    action = {
      type: getFeeds.fulfilled.type,
      payload: testOrders
    };

    state = feedReducer(
      { ...initialState, isLoading: true },
      action
    );

    const expectedState = {
      ...initialState,
      isLoading: false,
      error: null,
      orders: testOrders.orders,
      total: testOrders.total,
      totalToday: testOrders.totalToday
    };

    expect(state).toEqual(expectedState);
    expect(state.orders).toHaveLength(testOrders.orders.length);
    expect(state.orders[0].status).toBe(testOrders.orders[0].status);
  });

  it('проверка вызова экшена failed', () => {
    const action = {
      type: getFeeds.rejected.type,
      payload: defaultErrorMessage
    };

    state = feedReducer(
      { ...initialState, isLoading: true },
      action
    );

    const expectedState = {
      ...initialState,
      isLoading: false,
      error: defaultErrorMessage
    };

    expect(state).toEqual(expectedState);
    expect(state.error).toBe(defaultErrorMessage);
    expect(state.isLoading).toBe(false);
  });

  it('проверка вызова экшена pending с дополнительными параметрами', () => {
    action = { type: getFeeds.pending.type };
    state = feedReducer(
      { ...initialState, isLoading: false, error: 'Some previous error' },
      action
    );

    expect(state).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });
});
