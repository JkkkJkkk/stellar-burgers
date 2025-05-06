import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import type { RootState } from '../../store';
import type { default as OrderState } from './type';
import type { TOrder } from '@utils-types';

const initialState: OrderState = {
  orders: [],
  getOrderByNumberResponse: null,
  error: null,
  request: false,
  responseOrder: null
};

export const getOrderByNumber = createAsyncThunk<TOrder[], number>(
  'order/byNumber',
  async (number: number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      return response.orders;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Failed to fetch order'
      );
    }
  }
);

const orderReducer = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.error = null;
        state.request = true;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error = action.payload as string;
        state.request = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.error = null;
        state.request = false;
        const [order] = action.payload;
        state.getOrderByNumberResponse = order;
        state.responseOrder = order;
        state.orders = action.payload;
      });
  }
});

export const getOrderState = (state: RootState): OrderState => state.order;

export default orderReducer.reducer;
