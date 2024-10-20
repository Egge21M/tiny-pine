import { useEffect, useState } from "react";
import { getSecretKey, pool, relays } from "../utils/nostr";
import { Event, getPublicKey, nip44 } from "nostr-tools";
import { getConversationKey } from "nostr-tools/nip44";
import { Proof } from "@cashu/cashu-ts";

const useBalance = () => {
  const [balance, setBalance] = useState(0);

  useEffect(() => {
    const sk = getSecretKey();
    const pk = getPublicKey(sk);
    const convKey = getConversationKey(sk, pk);
    async function eventHandler(e: Event) {
      const decrypted = nip44.decrypt(e.content, convKey);
      const parsed = JSON.parse(decrypted);
      const amount = parsed.proofs.reduce(
        (a: number, c: Proof) => a + c.amount,
        0,
      );
      setBalance((p) => p + amount);
    }
    const sub = pool.subscribeMany(
      relays,
      [{ kinds: [7375], authors: [getPublicKey(getSecretKey())] }],
      { onevent: eventHandler },
    );
    return () => {
      sub.close();
    };
  }, []);

  return balance;
};

export default useBalance;
