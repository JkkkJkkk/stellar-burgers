import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { TUserState } from './type';
import * as userApi from '../../../utils/users-api';
import type { TLoginData, TRegisterData } from '@api';

const initialState: TUserState = {
  request: false,
  error: null,
  response: null,
  registerData: null,
  user: null,
  userOrders: [],
  isAuthChecked: false,
  isAuthenticated: false,
  loginUserRequest: false
};

const createUserThunk = <T>(type: string, apiCall: (data: T) => Promise<any>) =>
  createAsyncThunk(`user/${type}`, async (data: T, { rejectWithValue }) => {
    try {
      return await apiCall(data);
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  });

export const getRegisterUser = createUserThunk(
  'register',
  userApi.registerUser
);
export const getLoginUser = createUserThunk('login', userApi.loginUser);
export const updateUser = createUserThunk('update', userApi.updateUserData);
export const checkUserAuth = createAsyncThunk(
  'user/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      return await userApi.fetchUser();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  }
);

export const createSimpleThunk = (type: string, apiCall: () => Promise<any>) =>
  createAsyncThunk(`user/${type}`, async (_, { rejectWithValue }) => {
    try {
      return await apiCall();
    } catch (error) {
      return rejectWithValue((error as Error).message);
    }
  });

export const getUser = createSimpleThunk('getUser', userApi.fetchUser);
export const getOrders = createSimpleThunk(
  'getOrders',
  userApi.fetchUserOrders
);
export const getLogoutUser = createSimpleThunk('logout', userApi.logoutUser);

const handlePending = (state: TUserState) => {
  state.request = true;
  state.error = null;
};

const handleRejected = (state: TUserState, action: any) => {
  state.request = false;
  state.error = action.payload as string;
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    userLogout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    resetError: (state) => {
      state.error = null;
    },
    setAuthChecked: (state, action: PayloadAction<boolean>) => {
      state.isAuthChecked = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getRegisterUser.pending, handlePending)
      .addCase(getRegisterUser.rejected, (state, action) => {
        handleRejected(state, action);
        state.isAuthChecked = false;
      })
      .addCase(getRegisterUser.fulfilled, (state, { payload }) => {
        state.request = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(getLoginUser.pending, (state) => {
        state.loginUserRequest = true;
        state.error = null;
      })
      .addCase(getLoginUser.rejected, (state, action) => {
        state.loginUserRequest = false;
        state.error = action.payload as string;
      })
      .addCase(getLoginUser.fulfilled, (state, { payload }) => {
        state.loginUserRequest = false;
        state.user = payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(checkUserAuth.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(checkUserAuth.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(checkUserAuth.fulfilled, (state, { payload }) => {
        state.isAuthChecked = true;
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(getUser.fulfilled, (state, { payload }) => {
        state.isAuthChecked = true;
        state.user = payload.user;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.pending, handlePending)
      .addCase(updateUser.rejected, handleRejected)
      .addCase(updateUser.fulfilled, (state, { payload }) => {
        state.request = false;
        state.user = payload.user;
      })
      .addCase(getLogoutUser.pending, handlePending)
      .addCase(getLogoutUser.rejected, handleRejected)
      .addCase(getLogoutUser.fulfilled, (state) => {
        state.request = false;
        state.user = null;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
      })
      .addCase(getOrders.pending, handlePending)
      .addCase(getOrders.rejected, handleRejected)
      .addCase(getOrders.fulfilled, (state, { payload }) => {
        state.request = false;
        state.userOrders = payload;
      });
  }
});

export const { userLogout, resetError, setAuthChecked } = userSlice.actions;
export const selectUserState = (state: RootState) => state.user;
export default userSlice.reducer;
