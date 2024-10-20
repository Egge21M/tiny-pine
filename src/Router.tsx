import { createBrowserRouter, RouterProvider } from "react-router-dom";
import RootRoute from "./routes/RootRoute";
import ProductRoute from "./routes/product/ProductRoute";
import BasketRoute from "./routes/basket/BasketRoute";
import PaymentRoute from "./routes/payment/PaymentRoute";
import { useEffect, useRef, useState } from "react";
import { privateKeyFromSeedWords } from "nostr-tools/nip06";
import { hexToBytes } from "@noble/hashes/utils";
import { getSecretKey, pool, relays, setSecretKey } from "./utils/nostr";
import Button from "./components/Button";
import { getPublicKey, nip44 } from "nostr-tools";
import { getConversationKey } from "nostr-tools/nip44";
import { store, useAppDispatch } from "./store/store";
import { rehydrate } from "./store/products";
import { SubCloser } from "nostr-tools/abstract-pool";

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

function Router() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSetup, setIsSetup] = useState(false);
  const word1 = useRef<HTMLInputElement>(null);
  const word2 = useRef<HTMLInputElement>(null);
  const word3 = useRef<HTMLInputElement>(null);
  const word4 = useRef<HTMLInputElement>(null);
  const word5 = useRef<HTMLInputElement>(null);
  const word6 = useRef<HTMLInputElement>(null);
  const word7 = useRef<HTMLInputElement>(null);
  const word8 = useRef<HTMLInputElement>(null);
  const word9 = useRef<HTMLInputElement>(null);
  const word10 = useRef<HTMLInputElement>(null);
  const word11 = useRef<HTMLInputElement>(null);
  const word12 = useRef<HTMLInputElement>(null);

  const refArr = [
    word1,
    word2,
    word3,
    word4,
    word5,
    word6,
    word7,
    word8,
    word9,
    word10,
    word11,
    word12,
  ];

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
  return (
    <main className="flex flex-col items-center justify-center p-4 gap-4">
      <h1>TINYPINE</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {Array(12)
          .fill(0)
          .map((_, i) => (
            <input
              className="bg-zinc-200 p-2 rounded"
              placeholder={String(i + 1)}
              ref={refArr[i]}
            />
          ))}
      </div>
      <Button
        title="Confirm"
        onClick={() => {
          const mnemArr = [
            word1.current?.value,
            word2.current?.value,
            word3.current?.value,
            word4.current?.value,
            word5.current?.value,
            word6.current?.value,
            word7.current?.value,
            word8.current?.value,
            word9.current?.value,
            word10.current?.value,
            word11.current?.value,
            word12.current?.value,
          ];
          const mnemString = JSON.stringify(mnemArr);
          localStorage.setItem("tiny-mnem", mnemString);
          const key = privateKeyFromSeedWords(mnemArr.join(" "));
          const sk = hexToBytes(key);
          setSecretKey(sk);
          setIsSetup(true);
        }}
      />
    </main>
  );
}

export default Router;
