import { createRoot } from "react-dom/client";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store.ts";
import Router from "./Router.tsx";

createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <Router />
  </Provider>,
);
