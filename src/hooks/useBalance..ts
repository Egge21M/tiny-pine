import { useEffect, useState } from "react";
import { getSecretKey, pool, relays } from "../utils/nostr";
import { Event, getPublicKey, nip44 } from "nostr-tools";
import { getConversationKey } from "nostr-tools/nip44";
import { Proof } from "@cashu/cashu-ts";

const useBalance = () => {
  const [proofs, setProofs] = useState<Proof[]>([]);

  useEffect(() => {
    setProofs([]);
    const sk = getSecretKey();
    const pk = getPublicKey(sk);
    const convKey = getConversationKey(sk, pk);
    async function eventHandler(e: Event) {
      const decrypted = nip44.decrypt(e.content, convKey);
      const parsed = JSON.parse(decrypted);
      console.log(parsed);
      if (!parsed.proofs) {
        return;
      }
      setProofs((p) => [...p, ...parsed.proofs]);
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

  return proofs;
};

export default useBalance;
