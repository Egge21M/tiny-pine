import { useAppSelector } from "../store/store";

const useNextOrderId = () => {
  const orderIds = useAppSelector((state) => state.orders.oderIds)
    .map((id) => parseInt(id))
    .sort();
  if (orderIds.length === 0) {
    return 1;
  }
  return orderIds[orderIds.length - 1] + 1;
};

export default useNextOrderId;
