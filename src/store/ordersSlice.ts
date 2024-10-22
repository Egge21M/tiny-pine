import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../types";

export type OrdersState = {
  orders: { [orderId: string]: Order };
  oderIds: string[];
};

const initialState: OrdersState = {
  orders: {},
  oderIds: [],
};

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addOrder: (state, action: PayloadAction<Order>) => {
      if (state.orders[action.payload.id]) {
        console.warn("order id already present in store!");
        return;
      }
      state.orders[action.payload.id] = action.payload;
      state.oderIds.push(action.payload.id);
    },
    setOrderState: (
      state,
      action: PayloadAction<{ id: string; state: "PAID" | "UNPAID" }>,
    ) => {
      if (!state.orders[action.payload.id]) {
        console.error("id does not exist in store");
        return;
      }
      state.orders[action.payload.id].state = action.payload.state;
    },
  },
});

export const { addOrder, setOrderState } = ordersSlice.actions;

export default ordersSlice.reducer;
