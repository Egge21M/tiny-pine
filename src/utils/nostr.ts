import {
  CashuMint,
  CashuWallet,
  PaymentRequestPayload,
  Proof,
} from "@cashu/cashu-ts";
import {
  EventTemplate,
  finalizeEvent,
  getPublicKey,
  nip19,
  nip44,
  SimplePool,
  Event,
} from "nostr-tools";
import { getConversationKey } from "nostr-tools/nip44";
import { unwrapEvent } from "nostr-tools/nip59";

export const relays = [
  "wss://nostr-pub.wellorder.net",
  "wss://relay.8333.space",
  "wss://nos.lol",
  "wss://relay.damus.io",
];

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

export function createPaymentSubscription(eventHandler: (e: Event) => void) {
  const filters = [
    {
      kinds: [1059],
      "#p": [getPublicKey(getSecretKey())],
      since: Math.floor(Date.now() / 1000) - 172800,
    },
  ];
  return pool.subscribeMany(relays, filters, {
    onevent: eventHandler,
  });
}

export function unwrapPaymentRequestPayload(e: Event) {
  if (e.kind !== 1059) {
    throw new Error("event is not a gift wrap");
  }
  try {
    const paymentPayloadEvent = unwrapEvent(e, getSecretKey()) as Event;
    const parsedPayment = JSON.parse(
      paymentPayloadEvent.content,
    ) as PaymentRequestPayload;
    if (!parsedPayment.mint || !parsedPayment.proofs) {
      throw new Error("event is not a payment request payload");
    }
    return parsedPayment;
  } catch (e) {
    console.error(e);
    throw new Error("event is not a valid payment request");
  }
}

export async function sackProofs(mintUrl: string, proofs: Proof[]) {
  const mint = new CashuMint(mintUrl);
  const wallet = new CashuWallet(mint);
  const newProofs = await wallet.receive({
    token: [{ mint: mintUrl, proofs }],
  });

  const temp: EventTemplate = {
    created_at: Math.floor(Date.now() / 1000),
    kind: 7375,
    tags: [],
    content: nip44.encrypt(
      JSON.stringify({ mint: mintUrl, proofs: newProofs }),
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
