import {
  constructorReducer,
  addIngredientToConstructor,
  removeIngredientFromConstructor,
  moveIngredientUp,
  moveIngredientDown,
  initialState
} from './burgers';
import { TConstructorIngredient } from '@utils-types';

const createTestIngredient = (base: Partial<TConstructorIngredient>): TConstructorIngredient => ({
  _id: '1',
  name: 'Test',
  type: 'sauce',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: '',
  image_mobile: '',
  image_large: '',
  id: 'test1',
  ...base
});

describe('burgers reducer', () => {
  const sauce: TConstructorIngredient = createTestIngredient({
    name: 'Соус',
    type: 'sauce',
    id: 'sauce1'
  });

  const main: TConstructorIngredient = createTestIngredient({
    name: 'Говядина',
    type: 'main',
    id: 'main1'
  });

  const main2: TConstructorIngredient = createTestIngredient({
    ...main,
    id: 'main2'
  });

  const createStateWithIngredients = (ingredients: TConstructorIngredient[], bun: TConstructorIngredient | null = null) => ({
    ...initialState,
    constructorItems: {
      bun,
      ingredients
    }
  });

  describe('добавление ингредиентов в конструктор', () => {
    it('добавляет не-bun ингредиент в список', () => {
      const state = constructorReducer(initialState, addIngredientToConstructor(sauce));
      expect(state.constructorItems.ingredients).toEqual([
        expect.objectContaining({ ...sauce, id: expect.any(String) })
      ]);
    });

    it('устанавливает bun ингредиент', () => {
      const bun = createTestIngredient({ type: 'bun' });
      const state = constructorReducer(initialState, addIngredientToConstructor(bun));
      expect(state.constructorItems.bun).toEqual(
        expect.objectContaining({ ...bun, id: expect.any(String) })
      );
    });

    it('заменяет существующую булку', () => {
      const oldBun = createTestIngredient({ type: 'bun', id: 'oldBun' });
      const newBun = createTestIngredient({ type: 'bun', id: 'newBun', name: 'New Bun' });
      const state = createStateWithIngredients([], oldBun);
      
      const newState = constructorReducer(state, addIngredientToConstructor(newBun));
      expect(newState.constructorItems.bun?.name).toBe('New Bun');
    });
  });

  describe('Удаление компонента из конструктора', () => {
    it('удаляет ингредиент по id', () => {
      const state = createStateWithIngredients([sauce]);
      const newState = constructorReducer(state, removeIngredientFromConstructor('sauce1'));
      expect(newState.constructorItems.ingredients).toHaveLength(0);
    });
  });

  describe('перемещайте ингредиенты', () => {
    const state = createStateWithIngredients([sauce, main, main2]);

    it('перемещает ингредиент вверх', () => {
      const newState = constructorReducer(state, moveIngredientUp('main2'));
      expect(newState.constructorItems.ingredients.map(i => i.id)).toEqual(['sauce1', 'main2', 'main1']);
    });

    it('перемещает ингредиент вниз', () => {
      const newState = constructorReducer(state, moveIngredientDown('main1'));
      expect(newState.constructorItems.ingredients.map(i => i.id)).toEqual(['sauce1', 'main2', 'main1']);
    });

    it('игнорирует перемещение первого элемента вверх', () => {
      const newState = constructorReducer(state, moveIngredientUp('sauce1'));
      expect(newState.constructorItems.ingredients).toEqual(state.constructorItems.ingredients);
    });

    it('игнорирует перемещение последнего элемента вниз', () => {
      const newState = constructorReducer(state, moveIngredientDown('main2'));
      expect(newState.constructorItems.ingredients).toEqual(state.constructorItems.ingredients);
    });
  });
});