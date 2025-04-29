import { TIngredient } from '@utils-types';
import { StateError } from '../types';

interface IngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: StateError;
}

export default IngredientsState;
