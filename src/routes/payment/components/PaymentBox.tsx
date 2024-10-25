import QRCode from "react-qr-code";
import { useAppSelector } from "../../../store/store";

function PaymentBox({ setIsLightning, isLightning }) {
  const order = useAppSelector((state) => state.orders.activeOrder!);
  return (
    <div className="bg-zinc-100 shadow flex flex-col gap-2 items-center p-4 rounded">
      <p className="font-bold">
        Please pay {order.paymentRequest.amount} SATS!
      </p>
      <div className="bg-zinc-50 p-2 rounded">
        <QRCode value={order.lnFallback!.lnPr} />
      </div>
      <div className="flex w-full ">
        <button
          className={`${isLightning ? "" : "bg-purple-600"} grow transition duration-500 flex-1 rounded-s p-2`}
          onClick={() => {
            if (!isLightning) {
              return;
            }
            setIsLightning(false);
          }}
        >
          Cashu
        </button>
        <button
          className={`${isLightning ? "bg-orange-600" : ""} grow transition duration-500 flex-1 rounded-e p-2`}
          onClick={() => {
            if (isLightning) {
              return;
            }
            setIsLightning(true);
          }}
        >
          LN
        </button>
      </div>
      <button
        onClick={() => {
          if (isLightning) {
            navigator.clipboard.writeText(order.lnFallback!.lnPr);
          } else {
            navigator.clipboard.writeText(
              order.paymentRequest.toEncodedRequest(),
            );
          }
        }}
      >
        Copy Request
      </button>
      <button
        onClick={() => {
          setIsLightning(true);
        }}
      >
        Switch to Cashu
      </button>

      <p className="animate-pulse text-xs">Awaiting payment</p>
    </div>
  );
}

export default PaymentBox;
