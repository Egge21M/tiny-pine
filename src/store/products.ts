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
      if (state.products[action.payload.id]) {
        return;
      }
      state.products[action.payload.id] = action.payload;
    },
    rehydrate: (state, action: PayloadAction<ProductsState>) => {
      state.products = action.payload.products;
    },
  },
});

export const { addItem, rehydrate } = productsSlice.actions;

export default productsSlice.reducer;
