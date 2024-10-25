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
    deleteItem: (state, action: PayloadAction<string>) => {
      if (!state.products[action.payload]) {
        return;
      }
      delete state.products[action.payload];
    },
    rehydrate: (state, action: PayloadAction<ProductsState>) => {
      state.products = action.payload.products;
    },
  },
});

export const { addItem, rehydrate, deleteItem } = productsSlice.actions;

export default productsSlice.reducer;
