import { Proof } from "@cashu/cashu-ts";
import {
  EventTemplate,
  finalizeEvent,
  getPublicKey,
  nip19,
  nip44,
  SimplePool,
} from "nostr-tools";
import { getConversationKey } from "nostr-tools/nip44";

export const relays = ["wss://nostr-pub.wellorder.net"];

export const pool = new SimplePool();

let key: Uint8Array;

export function setSecretKey(sk: Uint8Array) {
  key = sk;
}

export function getSecretKey() {
  return key;
}

export function getPersonalConvKey() {
  return nip44.getConversationKey(getSecretKey(), getPublicKey(getSecretKey()));
}

export function getNProfile() {
  const sk = getSecretKey();
  console.log(sk);
  const pk = getPublicKey(getSecretKey());
  //TODO: This should be configurable
  return nip19.nprofileEncode({ pubkey: pk, relays });
}

export function sackProofs(mintUrl: string, proofs: Proof[]) {
  const temp: EventTemplate = {
    created_at: Math.floor(Date.now() / 1000),
    kind: 7375,
    tags: [[]],
    content: nip44.encrypt(
      JSON.stringify({ mint: mintUrl, proofs }),
      getPersonalConvKey(),
    ),
  };
  const event = finalizeEvent(temp, getSecretKey());
  return Promise.allSettled(pool.publish(relays, event));
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
