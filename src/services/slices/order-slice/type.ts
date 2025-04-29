import { TOrder } from '@utils-types';
import { Nullable, StateError } from '../types';

export type OrderNullable = Nullable<TOrder>;
type OrderState = {
  orders: TOrder[];
  getOrderByNumberResponse: OrderNullable;
  error: StateError;
  request: boolean;
  responseOrder: OrderNullable;
};

export default OrderState;
