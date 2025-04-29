import { forwardRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { TIngredientsCategoryProps } from './type';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { getConstructorState } from '../../services/slices/burgers-slice/burgers';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const { bun, ingredients: constructorItems } =
    useSelector(getConstructorState);

  const counters = useMemo(() => {
    const counts: Record<string, number> = {};
    constructorItems.forEach((item) => {
      counts[item._id] = (counts[item._id] || 0) + 1;
    });
    if (bun) counts[bun._id] = 2;
    return counts;
  }, [bun, constructorItems]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={counters}
      ref={ref}
    />
  );
});
