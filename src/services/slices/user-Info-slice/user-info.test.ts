import {
  userReducer,
  initialState as baseState,
  getRegisterUser,
  getLoginUser,
  checkUserAuth,
  updateUser,
  getLogoutUser,
  getOrders,
  userLogout,
  resetError,
  setAuthChecked
} from './user-info';
import { TUserState } from './type';
import { TOrder, TUser } from '@utils-types';
import { TRegisterData, TLoginData } from '@api';

const demoUser: TUser = {
  email: 'joani2018@yandex.ru',
  name: 'jkkk'
};

const demoOrders: TOrder[] = [
  {
    _id: '6624d9a8c3f7b9001cfa1234',
    status: 'done',
    name: 'Флюоресцентный космический бургер',
    createdAt: '2024-05-22T14:30:45.000Z',
    updatedAt: '2024-05-22T14:45:30.000Z',
    number: 25678,
    ingredients: [
      '643d69a5c3f7b9001cfa093c', 
      '643d69a5c3f7b9001cfa0941', 
      '643d69a5c3f7b9001cfa093c'
    ]
  }
];

const regPayload: TRegisterData = {
  email: 'joani2018@yandex.ru',
  password: 'c35yy6jx',
  name: 'jkkk'
};

const loginPayload: TLoginData = {
  email: 'joani2018@yandex.ru',
  password: 'c35yy6jx'
};

const authReply = { success: true, user: demoUser };
const tokenReply = { ...authReply, accessToken: 'accessToken', refreshToken: 'refreshToken' };

describe('userReducer tests', () => {
  test('userLogout resets user auth', () => {
    const state = { ...baseState, user: demoUser, isAuthenticated: true };
    expect(userReducer(state, userLogout())).toEqual({ ...state, user: null, isAuthenticated: false });
  });

  test('resetError clears error', () => {
    const faulty = { ...baseState, error: 'Error' };
    expect(userReducer(faulty, resetError())).toEqual({ ...faulty, error: null });
  });

  test('setAuthChecked updates flag', () => {
    expect(userReducer(baseState, setAuthChecked(true))).toEqual({ ...baseState, isAuthChecked: true });
  });

  describe('register/login/auth actions', () => {
    test('getRegisterUser pending', () => {
      const result = userReducer(baseState, getRegisterUser.pending('', regPayload));
      expect(result).toEqual({ ...baseState, request: true, error: null });
    });

    test('getRegisterUser fulfilled', () => {
      const result = userReducer(baseState, getRegisterUser.fulfilled(tokenReply, '', regPayload));
      expect(result).toEqual({
        ...baseState,
        request: false,
        user: demoUser,
        isAuthenticated: true,
        isAuthChecked: true
      });
    });

    test('getLoginUser pending', () => {
      const result = userReducer(baseState, getLoginUser.pending('', loginPayload));
      expect(result).toEqual({ 
        ...baseState, 
        loginUserRequest: true,
        error: null 
      });
    });

    test('getLoginUser fulfilled', () => {
      const result = userReducer(baseState, getLoginUser.fulfilled(tokenReply, '', loginPayload));
      expect(result).toEqual({
        ...baseState,
        loginUserRequest: false,
        user: demoUser,
        isAuthenticated: true,
        isAuthChecked: true
      });
    });

    test('checkUserAuth fulfilled', () => {
      const result = userReducer(baseState, checkUserAuth.fulfilled(authReply, ''));
      expect(result).toEqual({
        ...baseState,
        user: demoUser,
        isAuthenticated: true,
        isAuthChecked: true
      });
    });
  });

  describe('other async actions', () => {
    test('updateUser fulfilled', () => {
      const updatedUser = { name: 'Updated', email: 'updated@test.com' };
      const result = userReducer(baseState, 
        updateUser.fulfilled({ success: true, user: updatedUser }, '', regPayload));
      expect(result).toEqual({
        ...baseState,
        request: false,
        user: updatedUser
      });
    });

    test('getLogoutUser fulfilled', () => {
      const stateBefore: TUserState = { 
        ...baseState, 
        user: demoUser, 
        isAuthenticated: true,
        isAuthChecked: true
      };
      
      const result = userReducer(stateBefore, getLogoutUser.fulfilled(undefined, ''));
      
      expect(result).toEqual({
        ...stateBefore,
        user: null,
        isAuthenticated: false,
        request: false,
        isAuthChecked: true
      });
    });

    test('getOrders fulfilled', () => {
      const result = userReducer(baseState, getOrders.fulfilled(demoOrders, ''));
      expect(result).toEqual({
        ...baseState,
        request: false,
        userOrders: demoOrders
      });
    });
  });
});