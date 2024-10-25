import { createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import { addItem, deleteItem } from "./products";
import { AppDispatch, RootState } from "./store";
import { persistAppData } from "../utils/nostr";

const listener = createListenerMiddleware();

const appStartListening = listener.startListening.withTypes<
  RootState,
  AppDispatch
>();

appStartListening({
  matcher: isAnyOf(addItem, deleteItem),
  effect: async (_, listenerApi) => {
    const productState = listenerApi.getState().products;
    await persistAppData(productState, "pine-products");
  },
});

export default listener;
