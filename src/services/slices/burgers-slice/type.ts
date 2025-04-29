import { TConstructorIngredient, TOrder } from '@utils-types';
import { Nullable, StateError } from '../types';

export type BunState = Nullable<TConstructorIngredient>;
export type OrderModalData = Nullable<TOrder>;
export type IngredientsState = TConstructorIngredient[];
export type ConstructorItemsState = {
  bun: BunState;
  ingredients: IngredientsState;
};

export interface ConstructorState {
  constructorItems: ConstructorItemsState;
  orderRequest: boolean;
  orderModalData: OrderModalData;
  loading: boolean;
  error: StateError;
}

export default ConstructorState;
