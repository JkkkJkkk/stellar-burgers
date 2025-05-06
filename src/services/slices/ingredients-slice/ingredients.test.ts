import { ingredientReducer, getIngredients } from './ingredients';
import { TIngredient } from '@utils-types';

const mockBunIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

const mockSauceIngredient: TIngredient = {
  _id: '643d69a5c3f7b9001cfa0943',
  name: 'Соус традиционный галактический',
  type: 'sauce',
  proteins: 42,
  fat: 24,
  carbohydrates: 42,
  calories: 99,
  price: 15,
  image: 'https://code.s3.yandex.net/react/code/sauce-03.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-03-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-03-mobile.png'
};

const mockIngredientsArrayVersionOne: TIngredient[] = [mockBunIngredient, mockSauceIngredient];
const mockIngredientsArrayVersionTwo: TIngredient[] = [mockSauceIngredient, mockBunIngredient];
const mockIngredients: TIngredient[] = [...mockIngredientsArrayVersionOne];

const emptyInitialTestState = {
  ingredients: [],
  loading: false,
  error: null
};

const initialTestStateWithNulls = {
  ingredients: null,
  loading: null,
  error: null
};

const initialTestState = JSON.parse(JSON.stringify(emptyInitialTestState));

describe('проверка исходного состояния редуктора нарезки ингредиентов', () => {
  it('должен возвращать исходное состояние с пустым массивом ингредиентов', () => {
    const emptyAction = { type: '' };
    const state = ingredientReducer(undefined, emptyAction);
    expect(state).not.toBeNull();
    expect(state).not.toBeUndefined();
    expect(state).toBeDefined();
    expect(state).toHaveProperty('ingredients');
    expect(state.ingredients).toBeInstanceOf(Array);
    expect(state.ingredients).toHaveLength(0);
    expect(state).toMatchObject(initialTestState);
    expect(state).toEqual(initialTestState);
  });

  it('следует допускать только значение null в свойстве error для начального состояния', () => {
    const emptyAction = { type: '' };
    const state = ingredientReducer(undefined, emptyAction);
    
    expect(state.ingredients).not.toBeNull();
    expect(state.ingredients).not.toBeUndefined();
    
    expect(state.loading).not.toBeNull();
    expect(state.loading).not.toBeUndefined();
    
    expect(state.error).toBeNull();
  });
});;

describe('Полный набор тестов getIngredients action', () => {
  describe('ожидающая обработка состояний с различными начальными состояниями', () => {
    const pendingAction = { type: getIngredients.pending.type };

    it('должен обрабатывать ожидающее состояние с предыдущей ошибкой', () => {
      const stateWithError = {
        ...initialTestState,
        error: 'Предыдущее сообщение об ошибке, которое должно быть удалено'
      };
      const state = ingredientReducer(stateWithError, pendingAction);
      
      expect(state).toHaveProperty('loading', true);
      expect(state).toHaveProperty('error', null);
      expect(state.ingredients).toEqual(initialTestState.ingredients);
    });

    it('следует обрабатывать отложенное состояние с помощью существующих ингредиентов', () => {
      const stateWithIngredients = {
        ...initialTestState,
        ingredients: mockIngredientsArrayVersionTwo
      };
      const state = ingredientReducer(stateWithIngredients, pendingAction);
      
      expect(state.loading).toBeTruthy();
      expect(state.error).toBeNull();
      expect(state.ingredients).not.toHaveLength(0);
      expect(state.ingredients).toEqual(mockIngredientsArrayVersionTwo);
    });
  });

  describe('отработанная обработка состояния с несколькими тестовыми примерами', () => {
    const fulfilledAction = {
      type: getIngredients.fulfilled.type,
      payload: mockIngredients
    };

    it('должен обрабатывать выполненное состояние после загрузки', () => {
      const loadingState = {
        ...initialTestState,
        loading: true
      };
      const state = ingredientReducer(loadingState, fulfilledAction);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.ingredients).toBeDefined();
      expect(state.ingredients).not.toBeNull();
      expect(state.ingredients).toHaveLength(2);
      expect(state.ingredients[0]).toMatchObject(mockBunIngredient);
      expect(state.ingredients[1]).toMatchObject(mockSauceIngredient);
      expect(state.ingredients).toEqual(mockIngredients);
    });

    it('следует полностью заменить существующие ингредиенты', () => {
      const stateWithOldIngredients = {
        ...initialTestState,
        ingredients: [
          {
            _id: 'old',
            name: 'Old Ingredient',
            type: 'main',
            proteins: 0,
            fat: 0,
            carbohydrates: 0,
            calories: 0,
            price: 0,
            image: '',
            image_large: '',
            image_mobile: ''
          }
        ]
      };
      const state = ingredientReducer(stateWithOldIngredients, fulfilledAction);
      
      expect(state.ingredients).not.toContainEqual(stateWithOldIngredients.ingredients[0]);
      expect(state.ingredients).toEqual(mockIngredients);
    });
  });

  describe('обработка отклоненного состояния с тщательной проверкой ошибок', () => {
    const errorMessage = 'Не удалось достать ингредиенты';
    const rejectedAction = {
      type: getIngredients.rejected.type,
      payload: errorMessage,
      error: { message: errorMessage }
    };

    it('должен обрабатывать отклоненное состояние с сообщением об ошибке', () => {
      const loadingState = {
        ...initialTestState,
        loading: true
      };
      const state = ingredientReducer(loadingState, rejectedAction);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toHaveLength(0);
    });

    it('следует сохранить существующие ингредиенты, если запрос не выполнен', () => {
      const stateWithIngredients = {
        ...initialTestState,
        loading: true,
        ingredients: mockIngredients
      };
      const state = ingredientReducer(stateWithIngredients, rejectedAction);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.ingredients).toEqual(mockIngredients);
      expect(state.ingredients).toHaveLength(2);
    });

    it('должен обрабатывать разные форматы ошибок', () => {
      const errorActionWithString = {
        type: getIngredients.rejected.type,
        payload: 'Simple string error',
        error: { message: 'Simple string error' }
      };
      
      const state1 = ingredientReducer(
        { ...initialTestState, loading: true },
        errorActionWithString
      );
      expect(state1.error).toBe('Simple string error');

      const errorActionWithObject = {
        type: getIngredients.rejected.type,
        payload: { message: 'Error object' },
        error: { message: 'Error object' }
      };
      
      const state2 = ingredientReducer(
        { ...initialTestState, loading: true },
        errorActionWithObject
      );
      expect(state2.error).toEqual({ message: 'Error object' });
    });
  });
});

describe('дополнительные избыточные тесты для максимального охвата', () => {
  it('должен возвращать то же состояние для неизвестного действия', () => {
    const currentState = {
      ingredients: mockIngredients,
      loading: false,
      error: null
    };
    const state = ingredientReducer(currentState, { type: 'UNKNOWN_ACTION' });
    expect(state).toBe(currentState);
    expect(state).toEqual(currentState);
  });

  it('должен обрабатывать пустую полезную нагрузку в выполненном действии', () => {
    const action = {
      type: getIngredients.fulfilled.type,
      payload: undefined
    };
    const state = ingredientReducer(initialTestState, action);
    expect(state.ingredients).toBeUndefined();
  });

  it('должен обрабатывать нулевое начальное состояние', () => {
    const state = ingredientReducer(null as any, { type: '' });
    expect(state).toBeNull();
  });
});