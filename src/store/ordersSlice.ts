import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../types";
import { PaymentRequest } from "@cashu/cashu-ts";

export type OrdersState = {
  orders: { [orderId: string]: Order };
  oderIds: string[];
  activeOrder?: {
    orderId: string;
    paymentRequest: PaymentRequest;
    lnFallback?: {
      quoteId: string;
      lnPr: string;
    };
  };
};

const initialState: OrdersState = {
  orders: {},
  oderIds: [],
  activeOrder: undefined,
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
    setActiveOrder: (
      state,
      action: PayloadAction<{
        orderId: string;
        paymentRequest: PaymentRequest;
        lnFallback?: { quoteId: string; lnPr: string };
      }>,
    ) => {
      state.activeOrder = action.payload;
    },
    addLnFallback: (
      state,
      action: PayloadAction<{ quoteId: string; lnPr: string }>,
    ) => {
      if (!state.activeOrder) {
        return;
      }
      state.activeOrder.lnFallback = action.payload;
    },
    clearActiveOrder: (state) => {
      state.activeOrder = undefined;
    },
  },
});

export const {
  addOrder,
  setOrderState,
  setActiveOrder,
  addLnFallback,
  clearActiveOrder,
} = ordersSlice.actions;

export default ordersSlice.reducer;
