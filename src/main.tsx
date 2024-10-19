import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootRoute from "./routes/RootRoute.tsx";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import ProductRoute from "./routes/product/ProductRoute.tsx";
import BasketRoute from "./routes/basket/BasketRoute.tsx";
import PaymentRoute from "./routes/payment/PaymentRoute.tsx";
import { getSecretKey, pool, relays } from "./utils/nostr.ts";
import { getPublicKey, nip44 } from "nostr-tools";
import { rehydrate } from "./store/products.ts";
import { getConversationKey } from "nostr-tools/nip44";

const router = createBrowserRouter([
  {
    path: "",
    element: <RootRoute />,
    children: [
      { path: "/", element: <ProductRoute /> },
      { path: "/basket", element: <BasketRoute /> },
      { path: "/payment", element: <PaymentRoute /> },
    ],
  },
]);

const sub = pool.subscribeMany(
  relays,
  [{ kinds: [30078], authors: [getPublicKey(getSecretKey())] }],
  {
    onevent: (e) => {
      console.log(e);
      const dTag = e.tags.find((t) => t[0] === "d");
      console.log(dTag);
      if (dTag && dTag[1] === "pine-products") {
        console.log("runs");
        const payload = nip44.decrypt(
          e.content,
          getConversationKey(getSecretKey(), getPublicKey(getSecretKey())),
        );
        const parsed = JSON.parse(payload);
        console.log(parsed);
        store.dispatch(rehydrate(parsed));
      }
    },
  },
);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />,
  </Provider>,
);
