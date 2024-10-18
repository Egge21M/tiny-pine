import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { BasketItem } from "../types";

export type BasketState = {
  totalAmount: number;
  //TODO: This should probably be a map. I have to look into how to model this correctly.
  items: BasketItem[];
};

const initialState: BasketState = {
  totalAmount: 0,
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<BasketItem>) => {
      state.totalAmount = state.totalAmount + action.payload.price;
      state.items = [...state.items, action.payload];
    },
    clearBasket: (state) => {
      state.items = [];
      state.totalAmount = 0;
    },
  },
});

export const { addItem, clearBasket } = basketSlice.actions;

export default basketSlice.reducer;
