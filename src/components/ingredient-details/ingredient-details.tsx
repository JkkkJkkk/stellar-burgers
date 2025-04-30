import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';

import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { getIngredientState } from '../../services/slices/ingredients-slice/ingredients';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const { ingredients, loading, error } = useSelector(getIngredientState);

  const currentIngredient = useMemo(
    () => ingredients.find((item) => item._id === id),
    [ingredients, id]
  );

  if (loading) return <Preloader />;
  if (error)
    return <div className='text-center text-red-500'>Ошибка: {error}</div>;
  if (!currentIngredient)
    return <div className='text-center'>Ингредиент не найден</div>;

  return <IngredientDetailsUI ingredientData={currentIngredient} />;
};
