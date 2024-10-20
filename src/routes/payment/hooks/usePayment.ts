import {
  PaymentRequest,
  PaymentRequestPayload,
  PaymentRequestTransportType,
} from "@cashu/cashu-ts";
import { useEffect, useState } from "react";
import { SubCloser } from "nostr-tools/abstract-pool";
import { Event, getPublicKey } from "nostr-tools";
import { getSecretKey, pool, relays, sackProofs } from "../../../utils/nostr";
import { unwrapEvent } from "nostr-tools/nip59";

const usePayment = (paymentRequest?: PaymentRequest) => {
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState("");

  async function eventHandler(e: Event) {
    console.log("Received an event...");
    if (e.kind === 1059) {
      const paymentPayloadEvent = (await unwrapEvent(
        e,
        getSecretKey(),
      )) as Event;
      console.log("unwrapped: ", paymentPayloadEvent);
      const parsedPayment = JSON.parse(
        paymentPayloadEvent.content,
      ) as PaymentRequestPayload;
      const amount = parsedPayment.proofs.reduce((a, c) => a + c.amount, 0);
      if (
        paymentRequest!.id !== parsedPayment.id ||
        paymentRequest!.amount! > amount
      ) {
        throw new Error("Invalid payment payload");
      }
      await sackProofs(parsedPayment.mint, parsedPayment.proofs);
      setIsPaid(true);
    }
  }

  useEffect(() => {
    let sub: SubCloser;
    if (paymentRequest) {
      if (
        !paymentRequest.transport.find(
          (t) => t.type === PaymentRequestTransportType.NOSTR,
        )
      ) {
        setError("non nostr payment requests are not supported");
        return;
      }
      console.log("Setup subscription");
      const filters = [
        {
          kinds: [1059],
          "#p": [getPublicKey(getSecretKey())],
          since: Math.floor(Date.now() / 1000),
        },
      ];
      sub = pool.subscribeMany(relays, filters, {
        onevent: eventHandler,
      });
    }
    return () => {
      if (sub) {
        console.log("Closed sub...");
        sub.close();
      }
    };
  }, [paymentRequest]);
  return { isPaid, error };
};

export default usePayment;
