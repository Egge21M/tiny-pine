import {
  EventTemplate,
  finalizeEvent,
  generateSecretKey,
  getPublicKey,
  nip19,
  nip44,
  SimplePool,
} from "nostr-tools";
import { getConversationKey } from "nostr-tools/nip44";

export const relays = ["wss://nostr-pub.wellorder.net"];

export const pool = new SimplePool();

export function getSecretKey() {
  //TODO: Encrypt secret key / derive from words
  const storedKey = localStorage.getItem("tiny-sk");
  if (!storedKey) {
    const newKey = generateSecretKey();
    localStorage.setItem("tiny-sk", JSON.stringify(Array.from(newKey)));
    return newKey;
  }
  return new Uint8Array(JSON.parse(storedKey));
}

export function getNProfile() {
  const sk = getSecretKey();
  console.log(sk);
  const pk = getPublicKey(getSecretKey());
  //TODO: This should be configurable
  return nip19.nprofileEncode({ pubkey: pk, relays });
}

export async function persistAppData(appData: any, tag: string) {
  const template: EventTemplate = {
    kind: 30078,
    created_at: Math.floor(Date.now() / 1000),
    content: nip44.encrypt(
      JSON.stringify(appData),
      getConversationKey(getSecretKey(), getPublicKey(getSecretKey())),
    ),
    tags: [["d", tag]],
  };

  const event = finalizeEvent(template, getSecretKey());

  return Promise.allSettled(pool.publish(relays, event));
}
