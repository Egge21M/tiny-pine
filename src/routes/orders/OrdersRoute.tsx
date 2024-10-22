import { useAppSelector } from "../../store/store";

function OrdersRoute() {
  const orders = useAppSelector((state) => state.orders.orders);
  const ordersArr = Object.keys(orders)
    .map((id) => orders[id])
    .sort((a, b) => a.createdAt - b.createdAt);
  return (
    <main className="grow">
      <h1>Orders</h1>
      {ordersArr.map((o) => (
        <div>
          <p>{o.id}</p>
          <p>{o.createdAt}</p>
        </div>
      ))}
    </main>
  );
}

export default OrdersRoute;
