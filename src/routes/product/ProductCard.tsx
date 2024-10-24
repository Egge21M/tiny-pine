import { useDispatch } from "react-redux";
import { Item } from "../../types";
import { addItem } from "../../store/basket";

type ProductCardProps = {
  item: Item;
};

function ProductCard({ item }: ProductCardProps) {
  const dispatch = useDispatch();
  return (
    <button
      onClick={() => {
        dispatch(addItem({ name: item.name, price: item.price, id: item.id }));
      }}
      className="flex flex-col bg-zinc-50 rounded hover:shadow-xl transition shadow-md p-2 gap-2"
    >
      <div className="flex w-full items-center justify-between">
        <div className="text-left">
          <p className="font-bold">{item.name}</p>
          <p className="text-xs">{item.description}</p>
        </div>
        <p>{item.price} SATS</p>
      </div>
    </button>
  );
}

export default ProductCard;
