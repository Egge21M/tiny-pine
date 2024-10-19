import { createListenerMiddleware } from "@reduxjs/toolkit";
import { addItem } from "./products";
import { AppDispatch, RootState } from "./store";
import { persistAppData } from "../utils/nostr";

const listener = createListenerMiddleware();

const appStartListening = listener.startListening.withTypes<
  RootState,
  AppDispatch
>();

appStartListening({
  actionCreator: addItem,
  effect: async (action, listenerApi) => {
    const productState = listenerApi.getState().products;
    await persistAppData(productState, "pine-products");
  },
});

export default listener;
