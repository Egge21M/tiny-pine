import { PaymentRequest } from "@cashu/cashu-ts";
import { useEffect, useState } from "react";
import { SubCloser } from "nostr-tools/abstract-pool";
import { Event } from "nostr-tools";
import {
  createPaymentSubscription,
  sackProofs,
  unwrapPaymentRequestPayload,
} from "../../../utils/nostr";
import { validatePaymentRequestPayload } from "../../../utils/cashu";

const usePayment = (paymentRequest?: PaymentRequest) => {
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let sub: SubCloser;
    if (paymentRequest) {
      try {
        async function eventHandler(e: Event) {
          const parsedPayment = unwrapPaymentRequestPayload(e);
          validatePaymentRequestPayload(parsedPayment, paymentRequest!);
          await sackProofs(parsedPayment.mint, parsedPayment.proofs);
          setIsPaid(true);
        }
        sub = createPaymentSubscription(eventHandler);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message);
        }
      }
    }
    return () => {
      if (sub) {
        sub.close();
      }
    };
  }, [paymentRequest]);
  return { isPaid, error };
};

export default usePayment;
