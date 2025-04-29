import { TRegisterData } from '@api';
import { TOrder, TUser } from '@utils-types';
import type { StateError, Nullable } from '../types';

type TUserStateResponse = Nullable<TUser>;
type TUserStateRegisterData = Nullable<TRegisterData>;
type TUserStateAtr = Nullable<TUser>;
export type TUserState = {
  request: boolean;
  error: StateError;
  response: TUserStateResponse;
  registerData: TUserStateRegisterData;
  user: TUserStateAtr;
  userOrders: TOrder[];
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  loginUserRequest: boolean;
};

export default TUserState;
