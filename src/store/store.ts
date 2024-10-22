import { configureStore } from "@reduxjs/toolkit";
import basketReducer from "./basket";
import { useDispatch, useSelector } from "react-redux";
import productsReducer from "./products";
import listener from "./middleware";
import ordersReducer from "./ordersSlice";

export const store = configureStore({
  reducer: {
    basket: basketReducer,
    products: productsReducer,
    orders: ordersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listener.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
