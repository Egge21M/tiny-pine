import { useSearchParams } from "react-router-dom";
import { PaymentRequest } from "@cashu/cashu-ts";
import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import usePayment from "./hooks/usePayment";

function PaymentRoute() {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState("");
  const [paymentRequest, setPaymentRequest] = useState<PaymentRequest>();
  const encodedPaymentRequest = searchParams.get("pr");
  const { isPaid, error: paymentError } = usePayment(paymentRequest);

  useEffect(() => {
    if (!encodedPaymentRequest) {
      setError("No Payment Request provided");
    } else {
      try {
        const decoded = PaymentRequest.fromEncodedRequest(
          encodedPaymentRequest,
        );
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
    return (
      <main className="bg-zinc-100 grow flex flex-col justify-center items-center">
        <div className="bg-zinc-200 flex flex-col gap-2 items-center p-4 rounded">
          <p className="font-bold">Please pay {paymentRequest.amount} SATS</p>
          <div className="bg-zinc-100 p-2 rounded">
            {isPaid ? (
              <p>Order was paid</p>
            ) : (
              <QRCode value={paymentRequest.toEncodedRequest()} />
            )}
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
