import { FC, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BurgerConstructorUI } from '@ui';
import { TConstructorIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import {
  getConstructorState,
  getOrderBurger,
  getOrderModalData,
  getOrderRequest,
  resetModal,
  setRequest
} from '../../services/slices/burgers-slice/burgers';
import { selectUserState } from '../../services/slices/user-Info-slice/user-info';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector(selectUserState);
  const { bun, ingredients } = useSelector(getConstructorState);
  const orderRequest = useSelector(getOrderRequest);
  const orderModalData = useSelector(getOrderModalData);

  const ingredientIds = useMemo(() => {
    if (!bun) return [];
    return [bun._id, ...ingredients.map((i) => i._id), bun._id];
  }, [bun, ingredients]);

  const totalPrice = useMemo(() => {
    const bunCost = bun ? bun.price * 2 : 0;
    const ingredientsCost = ingredients.reduce(
      (sum, item) => sum + item.price,
      0
    );
    return bunCost + ingredientsCost;
  }, [bun, ingredients]);

  const handleOrderClick = () => {
    if (!isAuthenticated) return navigate('/login');
    if (!bun) return;
    dispatch(setRequest(true));
    dispatch(getOrderBurger(ingredientIds));
  };

  const handleCloseModal = () => {
    dispatch(setRequest(false));
    dispatch(resetModal());
  };

  return (
    <BurgerConstructorUI
      price={totalPrice}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={handleOrderClick}
      closeOrderModal={handleCloseModal}
    />
  );
};
