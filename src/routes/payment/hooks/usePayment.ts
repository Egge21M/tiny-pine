import { PaymentRequest } from "@cashu/cashu-ts";
import { useEffect, useState } from "react";
import { SubCloser } from "nostr-tools/abstract-pool";
import { Event } from "nostr-tools";
import {
  createPaymentSubscription,
  sackProofs,
  unwrapPaymentRequestPayload,
} from "../../../utils/nostr";
import { isValidPaymentRequestPayload } from "../../../utils/cashu";
import { clearBasket } from "../../../store/basket";
import { useDispatch } from "react-redux";

const usePayment = (paymentRequest?: PaymentRequest) => {
  const [isPaid, setIsPaid] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    let sub: SubCloser;
    console.log(paymentRequest);
    if (paymentRequest) {
      async function eventHandler(e: Event) {
        const parsedPayment = unwrapPaymentRequestPayload(e);
        const isValid = isValidPaymentRequestPayload(
          parsedPayment,
          paymentRequest!,
        );
        if (!isValid) {
          return;
        }
        await sackProofs(parsedPayment.mint, parsedPayment.proofs);
        setIsPaid(true);
        dispatch(clearBasket());
      }
      sub = createPaymentSubscription(eventHandler);
    }
    return () => {
      if (sub) {
        sub.close();
      }
    };
  }, [paymentRequest]);
  return { isPaid };
};

export default usePayment;
