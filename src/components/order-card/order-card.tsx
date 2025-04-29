import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { getIngredientState } from '../../services/slices/ingredients-slice/ingredients';

const MAX_INGREDIENTS = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const { ingredients } = useSelector(getIngredientState);

  const { ingredientsInfo, total, remains, date } = useMemo(() => {
    if (!ingredients.length) return {};

    const info = order.ingredients
      .map((id) => ingredients.find((ing) => ing._id === id))
      .filter(Boolean) as TIngredient[];

    return {
      ingredientsInfo: info,
      total: info.reduce((sum, ing) => sum + ing.price, 0),
      remains: Math.max(info.length - MAX_INGREDIENTS, 0),
      date: new Date(order.createdAt)
    };
  }, [order, ingredients]);

  if (!ingredientsInfo) return null;

  return (
    <OrderCardUI
      orderInfo={{
        ...order,
        ingredientsInfo,
        ingredientsToShow: ingredientsInfo.slice(0, MAX_INGREDIENTS),
        remains,
        total,
        date
      }}
      maxIngredients={MAX_INGREDIENTS}
      locationState={{ background: location }}
    />
  );
});
