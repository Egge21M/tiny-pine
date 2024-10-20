import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootRoute from "./routes/RootRoute";
import ProductRoute from "./routes/product/ProductRoute";
import BasketRoute from "./routes/basket/BasketRoute";
import PaymentRoute from "./routes/payment/PaymentRoute";
import { useEffect, useState } from "react";
import { privateKeyFromSeedWords } from "nostr-tools/nip06";
import { hexToBytes } from "@noble/hashes/utils";
import { getSecretKey, pool, relays, setSecretKey } from "./utils/nostr";
import { getPublicKey, nip44 } from "nostr-tools";
import { getConversationKey } from "nostr-tools/nip44";
import { useAppDispatch } from "./store/store";
import { rehydrate } from "./store/products";
import { SubCloser } from "nostr-tools/abstract-pool";
import WalletRoute from "./routes/wallet/WalletRoute";
import Setup from "./routes/setup/SetupRoute";
import SettingsRoute from "./routes/settings/SettingsRoute";

const router = createBrowserRouter([
  {
    path: "",
    element: <RootRoute />,
    children: [
      { path: "/", element: <ProductRoute /> },
      { path: "/basket", element: <BasketRoute /> },
      { path: "/payment", element: <PaymentRoute /> },
      { path: "/wallet", element: <WalletRoute /> },
      { path: "/settings", element: <SettingsRoute /> },
    ],
  },
]);

function Router() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSetup, setIsSetup] = useState(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedMnemonic = localStorage.getItem("tiny-mnem");
    if (storedMnemonic) {
      const parsed = JSON.parse(storedMnemonic);
      const privateKey = privateKeyFromSeedWords(parsed.join(" "));
      const bytes = hexToBytes(privateKey);
      setSecretKey(bytes);
      setIsSetup(true);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    let sub: SubCloser;
    if (isSetup) {
      sub = pool.subscribeMany(
        relays,
        [{ kinds: [30078], authors: [getPublicKey(getSecretKey())] }],
        {
          onevent: (e) => {
            const dTag = e.tags.find((t) => t[0] === "d");
            if (dTag && dTag[1] === "pine-products") {
              const payload = nip44.decrypt(
                e.content,
                getConversationKey(
                  getSecretKey(),
                  getPublicKey(getSecretKey()),
                ),
              );
              const parsed = JSON.parse(payload);
              dispatch(rehydrate(parsed));
            }
          },
          oneose: () => {
            sub.close();
          },
        },
      );
    }
    return () => {
      if (sub) {
        sub.close();
      }
    };
  }, [isSetup]);

  if (isLoading) {
    return null;
  }
  if (isSetup) {
    return <RouterProvider router={router} />;
  }
  return <Setup setIsSetup={setIsSetup} />;
}

export default Router;
