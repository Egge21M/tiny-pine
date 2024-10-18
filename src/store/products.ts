import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Item } from "../types";

export type ProductsState = {
  products: { [itemId: string]: Item };
};

const initialState: ProductsState = {
  products: {},
};

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<Item>) => {
      console.log("received");
      console.log(action.payload);
      if (state.products[action.payload.id]) {
        return;
      }
      state.products[action.payload.id] = action.payload;
    },
  },
});

export const { addItem } = productsSlice.actions;

export default productsSlice.reducer;
