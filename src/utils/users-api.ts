import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  type TLoginData,
  type TRegisterData,
  updateUserApi
} from '@api';
import { deleteCookie, setCookie } from './cookie';

const handleAuthResponse = (data: {
  success: boolean;
  accessToken: string;
  refreshToken: string;
}) => {
  if (!data.success) throw new Error('Authentication failed');

  setCookie('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  return data;
};

export const registerUser = (registerData: TRegisterData) =>
  registerUserApi(registerData).then(handleAuthResponse);

export const loginUser = ({ email, password }: TLoginData) =>
  loginUserApi({ email, password }).then(handleAuthResponse);

export const fetchUser = () => getUserApi();

export const fetchUserOrders = () => getOrdersApi();

export const updateUserData = (userData: TRegisterData) =>
  updateUserApi(userData);

export const logoutUser = async () => {
  await logoutApi();
  localStorage.removeItem('refreshToken');
  deleteCookie('accessToken');
};
