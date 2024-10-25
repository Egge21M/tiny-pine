import { Link, useNavigate } from "react-router-dom";
import { LuTreePine } from "react-icons/lu";

function NavBar() {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-zinc-900 text-zinc-100 border-black border-b-[1px] flex items-center justify-between p-2">
      <div className="flex items-center gap-1">
        <LuTreePine className="text-xl" />
        <p className="font-bold text-xl">TINYPINE</p>
      </div>
      <div className="flex gap-4 items-center">
        <Link to="/wallet">Wallet</Link>
        <Link to="/">Items</Link>
        <Link to="/orders">Orders</Link>
        <Link to="/settings">Settings</Link>
        <button
          onClick={() => {
            localStorage.clear();
            navigate(0);
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default NavBar;
