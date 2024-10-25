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
import { useAppSelector } from "../../../store/store";
import { CashuMint, CashuWallet } from "@cashu/cashu-ts";

const usePayment = () => {
  const [isPaid, setIsPaid] = useState(false);
  const [isLightning, setIsLightning] = useState(false);
  const order = useAppSelector((state) => state.orders.activeOrder);
  const paymentRequest = order?.paymentRequest;

  const dispatch = useDispatch();

  useEffect(() => {
    let sub: SubCloser;
    let interval: number;
    function handlePaid(cleanUp: () => void) {
      setIsPaid(true);
      dispatch(clearBasket());
      cleanUp();
    }

    if (paymentRequest && isLightning) {
      async function checkPayment() {
        if (!paymentRequest || !paymentRequest.mints?.length) {
          return;
        }
        const mint = paymentRequest.mints[0];
        const wallet = new CashuWallet(new CashuMint(mint));
        const { state } = await wallet.checkMintQuote(
          order.lnFallback!.quoteId,
        );
        if (state === "PAID") {
          const { proofs } = await wallet.mintTokens(
            paymentRequest.amount!,
            order.lnFallback.quoteId,
          );
          await sackProofs(mint, proofs);
          handlePaid(() => {
            clearInterval(interval);
          });
        }
      }
      interval = setInterval(checkPayment, 2500);
    } else {
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
          handlePaid(() => {
            sub.close();
          });
        }
        sub = createPaymentSubscription(eventHandler);
      }
    }
    return () => {
      if (sub) {
        sub.close();
      }
      console.log("Clearing interval...");
      clearInterval(interval);
    };
  }, [paymentRequest, isLightning]);
  return { isPaid, isLightning, setIsLightning };
};

export default usePayment;
