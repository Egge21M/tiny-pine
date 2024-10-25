import usePayment from "./hooks/usePayment";
import Confetti from "react-confetti";
import { FaCheckCircle } from "react-icons/fa";
import { useAppSelector } from "../../store/store";
import PaymentBox from "./components/PaymentBox";

function PaymentRoute() {
  const order = useAppSelector((state) => state.orders.activeOrder);
  const { isPaid, isLightning, setIsLightning } = usePayment();
  console.log("Comp: ", isLightning);
  console.log("paid: ", isPaid);

  //TODO: Refactor component for DRY

  if (!order) {
    return;
  }

  if (isPaid) {
    return (
      <main className="grow flex justify-center items-center">
        <div className="bg-zinc-100 shadow p-4 rounded flex flex-col items-center">
          <FaCheckCircle className="text-7xl text-emerald-600" />
          <p>Order was paid</p>
        </div>
        <Confetti recycle={false} />
      </main>
    );
  }
  if (isLightning) {
    return (
      <main className="bg-zinc-50 grow flex flex-col justify-center items-center">
        <PaymentBox setIsLightning={setIsLightning} isLightning={isLightning} />
      </main>
    );
  }
  return (
    <main className="bg-zinc-50 grow flex flex-col justify-center items-center">
      <PaymentBox setIsLightning={setIsLightning} isLightning={isLightning} />
    </main>
  );
}

export default PaymentRoute;
