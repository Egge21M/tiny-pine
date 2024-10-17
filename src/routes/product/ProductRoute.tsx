import React from "react";
import { useAppDispatch } from "../../store/store";
import { addItem } from "../../store/basket";

function ProductRoute() {
  const dispatch = useAppDispatch();
  return (
    <main className="grow bg-zinc-100 p-4">
      <h1>Products</h1>
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={() => {
            dispatch(
              addItem({ name: "coffee", price: 21, id: "madeira-coffee" }),
            );
          }}
          className="flex flex-col rounded bg-zinc-200 p-2"
        >
          <div
            className="w-full h-16 bg-orange-100
            "
          ></div>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p>Coffee</p>
              <p className="text-xs">Drink while it is still hot...</p>
            </div>
            <p>2 SATS</p>
          </div>
        </button>
        <button
          onClick={() => {
            dispatch(
              addItem({ name: "coffee", price: 21, id: "madeira-coffee" }),
            );
          }}
          className="flex flex-col rounded bg-zinc-200 p-2"
        >
          <div
            className="w-full h-16 bg-orange-100
            "
          ></div>
          <div className="flex items-center justify-between">
            <div className="text-left">
              <p>Steak</p>
              <p className="text-xs">Rare and tasty</p>
            </div>
            <p>21 SATS</p>
          </div>
        </button>
      </div>
    </main>
  );
}

export default ProductRoute;
