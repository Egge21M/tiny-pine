import { FaCheck, FaClock } from "react-icons/fa";
import { useAppSelector } from "../../store/store";

function OrdersRoute() {
  const orders = useAppSelector((state) => state.orders.orders);
  const ordersArr = Object.keys(orders)
    .map((id) => orders[id])
    .sort((a, b) => a.createdAt - b.createdAt);
  return (
    <main className="grow p-4">
      <h1>Orders</h1>
      <div className="max-w-xl">
        {ordersArr.map((o) => (
          <div className="flex w-full items-stretch gap-2">
            <div className="flex grow bg-zinc-100 shadow p-2 justify-between items-center">
              <p>{o.id}</p>
              <p className="text-zinc-600 text-xs">
                {new Date(o.createdAt * 1000).toUTCString()}
              </p>
            </div>
            <div className="bg-zinc-100 rounded shadow flex items-center justify-center p-2">
              {o.state === "PAID" ? (
                <FaCheck />
              ) : (
                <FaClock className="text-zinc-600" />
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export default OrdersRoute;
