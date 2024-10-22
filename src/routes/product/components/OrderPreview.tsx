import { useMemo } from "react";
import { useAppSelector } from "../../../store/store";
import { BasketItem } from "../../../types";
import { useNavigate } from "react-router-dom";

function OrderPreview() {
  const items = useAppSelector((state) => state.basket.items);
  // const totalAmount = useAppSelector((state) => state.basket.totalAmount);
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

  return (
    <div className="bg-zinc-100 flex flex-col grow p-2">
      <div className="grow">
        <p className="text-xs text-zinc-700">Active Order</p>
        <div className="flex flex-col gap-1">
          {Object.keys(structuredItems).map((id) => (
            <div className="bg-zinc-200 flex p-2 rounded justify-between text-zinc-700 text-sm">
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
      </div>
      <button
        className="w-full border-emerald-600 py-1 px-2 border-[2px] rounded text-emerald-600 hover:bg-emerald-200 active:bg-emerald-300"
        onClick={() => {
          navigate("/basket");
        }}
      >
        Checkout
      </button>
    </div>
  );
}

export default OrderPreview;
