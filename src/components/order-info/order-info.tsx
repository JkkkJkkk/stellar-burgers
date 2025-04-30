import { FC, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from '../../services/store';
import {
  getOrderByNumber,
  getOrderState
} from '../../services/slices/order-slice/order';
import { getIngredientState } from '../../services/slices/ingredients-slice/ingredients';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();
  const { getOrderByNumberResponse, request } = useSelector(getOrderState);
  const { ingredients } = useSelector(getIngredientState);

  useEffect(() => {
    if (number) dispatch(getOrderByNumber(parseInt(number)));
  }, [dispatch, number]);

  const orderInfo = useMemo(() => {
    if (!getOrderByNumberResponse || !ingredients.length) return null;

    const ingredientsMap = getOrderByNumberResponse.ingredients.reduce<
      Record<string, TIngredient & { count: number }>
    >((acc, id) => {
      const found = ingredients.find((ing) => ing._id === id);
      if (found) acc[id] = { ...found, count: (acc[id]?.count || 0) + 1 };
      return acc;
    }, {});

    return {
      ...getOrderByNumberResponse,
      ingredientsInfo: ingredientsMap,
      date: new Date(getOrderByNumberResponse.createdAt),
      total: Object.values(ingredientsMap).reduce(
        (sum, item) => sum + item.price * item.count,
        0
      )
    };
  }, [getOrderByNumberResponse, ingredients]);

  if (request || !orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
