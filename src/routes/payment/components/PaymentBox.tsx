import QRCode from "react-qr-code";
import { useAppSelector } from "../../../store/store";
import { LuNut } from "react-icons/lu";
import { FaBolt } from "react-icons/fa";
import { Dispatch, SetStateAction } from "react";

type PaymentBoxProps = {
  setIsLightning: Dispatch<SetStateAction<boolean>>;
  isLightning: boolean;
};

function PaymentBox({ setIsLightning, isLightning }: PaymentBoxProps) {
  const order = useAppSelector((state) => state.orders.activeOrder!);

  function copyHandler() {
    navigator.clipboard.writeText(
      isLightning
        ? order.lnFallback?.lnPr
        : order.paymentRequest.toEncodedRequest(),
    );
  }

  return (
    <div className="bg-zinc-100 shadow flex flex-col gap-2 items-center p-4 rounded">
      <p className="font-bold">
        Please pay {order.paymentRequest.amount} SATS!
      </p>
      <p className="animate-pulse text-xs">Awaiting payment</p>
      <div className="bg-zinc-50 p-2 rounded">
        <QRCode
          value={
            isLightning
              ? order.lnFallback!.lnPr
              : order.paymentRequest.toEncodedRequest()
          }
          onClick={copyHandler}
        />
      </div>
      <div className="flex w-full ">
        <button
          className={`${isLightning ? "bg-zinc-300" : "bg-zinc-400"} grow transition duration-500 flex-1 flex items-center justify-center rounded-s px-2 py-1`}
          onClick={() => {
            if (!isLightning) {
              return;
            }
            setIsLightning(false);
          }}
        >
          <LuNut
            className={
              isLightning
                ? "text-zinc-600 transition duration-500"
                : "text-purple-600 transition duration-500"
            }
          />
        </button>
        <button
          className={`${isLightning ? "bg-zinc-400" : "bg-zinc-300"} grow transition duration-500 flex-1 flex items-center justify-center rounded-e px-2 py-1`}
          onClick={() => {
            if (isLightning) {
              return;
            }
            setIsLightning(true);
          }}
        >
          <FaBolt
            className={
              isLightning
                ? "text-orange-600 transition duration-500"
                : "text-zinc-400 transition duration-500"
            }
          />
        </button>
      </div>
    </div>
  );
}

export default PaymentBox;
