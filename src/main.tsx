import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootRoute from "./routes/RootRoute.tsx";
import { Provider } from "react-redux";
import { persistor, store } from "./store/store.ts";
import ProductRoute from "./routes/product/ProductRoute.tsx";
import { PersistGate } from "redux-persist/integration/react";
import BasketRoute from "./routes/basket/BasketRoute.tsx";
import PaymentRoute from "./routes/payment/PaymentRoute.tsx";

const router = createBrowserRouter([
  {
    path: "",
    element: <RootRoute />,
    children: [
      { path: "/basket", element: <BasketRoute /> },
      { path: "/products", element: <ProductRoute /> },
      { path: "/payment", element: <PaymentRoute /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <RouterProvider router={router} />,
    </PersistGate>
  </Provider>,
);
