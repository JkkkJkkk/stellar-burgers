import { TOrder } from '@utils-types';
import { StateError } from '../types';

export interface IFeedsResponse {
  orders: TOrder[];
  total: number;
  totalToday: number;
}

export interface IFeedState {
  orders: TOrder[];
  total: number;
  totalToday: number;
  isLoading: boolean;
  error: StateError;
}
