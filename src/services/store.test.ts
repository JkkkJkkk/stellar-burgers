import { rootReducer } from './store';
import { constructorReducer } from './slices/burgers-slice/burgers';
import { ingredientReducer } from './slices/ingredients-slice/ingredients';
import { userReducer } from './slices/user-Info-slice/user-info';
import { feedReducer } from './slices/feed-slice/feed';
import orderReducer from './slices/order-slice/order';
import type { RootState } from './store';

interface TestCase {
  key: keyof RootState;
  reducer: (state: any, action: any) => any;
}

const testReducerInitialization = (reducer: (state: any, action: any) => any) => {
  return reducer(undefined, { type: '@@INIT' });
};

describe('rootReducer инициализация', () => {
  const initialState = rootReducer(undefined, { type: '@@INIT' });

  const testCases: TestCase[] = [
    { key: 'burders', reducer: constructorReducer },
    { key: 'ingredients', reducer: ingredientReducer },
    { key: 'user', reducer: userReducer },
    { key: 'feed', reducer: feedReducer },
    { key: 'order', reducer: orderReducer }
  ];

  testCases.forEach(({ key, reducer }) => {
    it(`should initialize ${key} state correctly`, () => {
      expect(initialState[key]).toEqual(testReducerInitialization(reducer));
    });
  });
});