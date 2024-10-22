import { useSearchParams } from "react-router-dom";
import { PaymentRequest } from "@cashu/cashu-ts";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import usePayment from "./hooks/usePayment";
import Confetti from "react-confetti";
import { FaCheckCircle } from "react-icons/fa";

function PaymentRoute() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>();
  const encodedPaymentRequest = searchParams.get("pr");
  const { isPaid } = usePayment(paymentRequest);

  //TODO: Add animation and haptics

  useEffect(() => {
    if (!encodedPaymentRequest) {
      setError("No Payment Request provided");
    } else {
      try {
        const decoded = PaymentRequest.fromEncodedRequest(
          encodedPaymentRequest,
        );
        console.log(decoded);
        setPaymentRequest(decoded);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    }
  }, [encodedPaymentRequest]);

  if (error) {
    return (
      <main className="bg-zinc-100 grow flex items-center justify-center">
        <p className="text-orange-500 font-bold">{error}</p>
      </main>
    );
  }
  if (paymentRequest) {
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
    return (
      <main className="bg-zinc-50 grow flex flex-col justify-center items-center">
        <div className="bg-zinc-100 shadow flex flex-col gap-2 items-center p-4 rounded">
          <p className="font-bold">Please pay {paymentRequest.amount} SATS</p>
          <div className="bg-zinc-50 p-2 rounded">
            <QRCode value={paymentRequest.toEncodedRequest()} />
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(paymentRequest.toEncodedRequest());
            }}
          >
            Copy Request
          </button>
          <p className="animate-pulse text-xs">Awaiting payment</p>
        </div>
      </main>
    );
  }
}

export default PaymentRoute;
