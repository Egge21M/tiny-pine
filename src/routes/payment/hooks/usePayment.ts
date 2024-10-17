import { PaymentRequest, PaymentRequestTransportType } from "@cashu/cashu-ts";
import { useEffect, useState } from "react";
import { SubCloser } from "nostr-tools/abstract-pool";
import { Event, nip04 } from "nostr-tools";
import { getSecretKey, pool } from "../../../utils/nostr";

const usePayment = (paymentRequest: PaymentRequest) => {
  const [isPaid, setIsPaid] = useState(false);
  const [error, setError] = useState("");
  const sk = getSecretKey();

  async function eventHandler(e: Event) {
    if (e.kind === 4) {
      const decrypted = await nip04.decrypt(sk, e.pubkey, e.content);
      try {
        const payload = JSON.parse(decrypted);
        console.log(payload);
      } catch (e) {
        console.log(e);
      }
    }
  }

  useEffect(() => {
    let sub: SubCloser;
    if (paymentRequest) {
      if (
        !paymentRequest.transport.find(
          (t) => t.target === PaymentRequestTransportType.NOSTR,
        )
      ) {
        setError("non nostr payment requests are not supported");
        return;
      }
      sub = pool.subscribeMany([], [], { onevent: eventHandler });
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
