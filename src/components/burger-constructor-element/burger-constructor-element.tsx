import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import {
  moveIngredientDown,
  moveIngredientUp,
  removeIngredientFromConstructor
} from '../../services/slices/burgers-slice/burgers';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const dispatch = useDispatch();

    const handleMoveDown = () => dispatch(moveIngredientDown(ingredient.id));

    const handleMoveUp = () => dispatch(moveIngredientUp(ingredient.id));

    const handleClose = () =>
      dispatch(removeIngredientFromConstructor(ingredient.id));

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
