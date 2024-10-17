import { Link } from "react-router-dom";
import { useAppSelector } from "./store/store";

function NavBar() {
  const basketSize = useAppSelector((state) => state.basket.items.length);
  return (
    <div className="w-full bg-zinc-100 border-black border-b-[1px] flex items-center justify-between p-2">
      <p className="font-bold text-xl">TINYPINE</p>
      <div className="flex gap-2 items-center">
        <Link to="/products">Items</Link>
        <Link to={"/basket"} className="flex gap-1 rounded px-2 py-1">
          <p className="px-2 py-1 border-black border-[1px] rounded">Basket</p>
          {basketSize > 0 ? (
            <p className="bg-orange-300 px-2 py-1 rounded ">{basketSize}</p>
          ) : undefined}
        </Link>
      </div>
    </div>
  );
}

export default NavBar;
