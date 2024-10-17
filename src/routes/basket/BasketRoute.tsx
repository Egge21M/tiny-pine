import { useMemo } from "react";
import { useAppSelector } from "../../store/store";
import { PaymentRequest, PaymentRequestTransportType } from "@cashu/cashu-ts";
import { useNavigate } from "react-router-dom";
import { getNProfile } from "../../utils/nostr";

function BasketRoute() {
  const items = useAppSelector((state) => state.basket.items);
  const totalAmount = useAppSelector((state) => state.basket.totalAmount);
  const structuorangeItems = useMemo(() => {
    const map: { [itemId: string]: { item: any; qnt: number } } = {};
    items.forEach((i) => {
      if (map[i.id]) {
        map[i.id].qnt++;
      } else {
        map[i.id] = { item: i, qnt: 1 };
      }
    });
    return map;
  }, items);

  const navigate = useNavigate();

  function checkoutHandler() {
    const pr = new PaymentRequest(
      [
        {
          type: PaymentRequestTransportType.NOSTR,
          target: getNProfile(),
          tags: [["m", "NIP-04"]],
        },
      ],
      window.crypto.randomUUID(),
      totalAmount,
      "sat",
      ["https://mint.minibits.cash/Bitcoin"],
      "tiny-pine",
    );
    navigate(`/payment?pr=${pr.toEncodedRequest()}`);
  }
  return (
    <main className="bg-zinc-100 grow p-4">
      <h1>Basket</h1>
      <div className="flex flex-col">
        {Object.keys(structuorangeItems).map((id) => (
          <div className="bg-zinc-200 flex p-2 rounded justify-between text-black">
            <div className="flex gap-2">
              <p>{structuorangeItems[id].qnt}x</p>
              <p>{structuorangeItems[id].item.name}</p>
            </div>
            <p>
              {structuorangeItems[id].qnt * structuorangeItems[id].item.price} SATS
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs">Total: {totalAmount} SATS</p>
      <button
        className="bg-zinc-300 px-2 py-1 rounded"
        onClick={checkoutHandler}
      >
        Checkout
      </button>
    </main>
  );
}

export default BasketRoute;
