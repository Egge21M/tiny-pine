import { useMemo } from "react";
import { useAppSelector } from "../../store/store";
import { PaymentRequest, PaymentRequestTransportType } from "@cashu/cashu-ts";
import { useNavigate } from "react-router-dom";
import { getNProfile } from "../../utils/nostr";
import { clearBasket } from "../../store/basket";
import { useDispatch } from "react-redux";
import Button from "../../components/Button";
import { BasketItem } from "../../types";
import { addOrder } from "../../store/ordersSlice";
import useNextOrderId from "../../hooks/useNextOrderId";
import { bytesToHex } from "@noble/hashes/utils";

function BasketRoute() {
  const items = useAppSelector((state) => state.basket.items);
  const totalAmount = useAppSelector((state) => state.basket.totalAmount);
  const structuredItems = useMemo(() => {
    const map: { [itemId: string]: { item: BasketItem; qnt: number } } = {};
    items.forEach((i) => {
      if (map[i.id]) {
        map[i.id].qnt++;
      } else {
        map[i.id] = { item: i, qnt: 1 };
      }
    });
    return map;
  }, [items]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const nextOrderId = useNextOrderId();
  console.log(nextOrderId);

  function checkoutHandler() {
    const paymentId = bytesToHex(
      window.crypto.getRandomValues(new Uint8Array(16)),
    );
    const pr = new PaymentRequest(
      [
        {
          type: PaymentRequestTransportType.NOSTR,
          target: getNProfile(),
          tags: [["m", "NIP-17"]],
        },
      ],
      paymentId,
      totalAmount,
      "sat",
      ["https://nofees.testnut.cashu.space"],
    );
    dispatch(
      addOrder({
        id: String(nextOrderId),
        amount: totalAmount,
        createdAt: Math.floor(Date.now() / 1000),
        state: "UNPAID",
        paymentId: paymentId,
      }),
    );
    navigate(`/payment?pr=${pr.toEncodedRequest()}`);
  }
  return (
    <main className="bg-zinc-100 grow flex flex-col gap-4 p-4">
      <h1>Basket</h1>
      <div className="flex flex-col gap-1 max-w-sm">
        {Object.keys(structuredItems).map((id) => (
          <div className="bg-zinc-200 flex p-2 rounded justify-between text-black">
            <div className="flex gap-2">
              <p>{structuredItems[id].qnt}x</p>
              <p>{structuredItems[id].item.name}</p>
            </div>
            <p>
              {structuredItems[id].qnt * structuredItems[id].item.price} SATS
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs">Total: {totalAmount} SATS</p>
      <div className="flex gap-2">
        <Button title="Checkout" onClick={checkoutHandler} />
        <Button
          title="Clear Basket"
          onClick={() => {
            dispatch(clearBasket());
          }}
        />
      </div>
    </main>
  );
}

export default BasketRoute;
