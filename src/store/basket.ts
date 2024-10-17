import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type Item = {
  name: string;
  price: number;
  id: string;
};

export type BasketState = {
  totalAmount: number;
  //TODO: This should probably be a map. I have to look into how to model this correctly.
  items: Item[];
};

const initialState: BasketState = {
  totalAmount: 0,
  items: [],
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      state.totalAmount = state.totalAmount + action.payload.price;
      state.items = [...state.items, action.payload];
    },
  },
});

export const { addItem } = basketSlice.actions;

export default basketSlice.reducer;
