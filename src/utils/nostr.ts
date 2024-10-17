import {
  generateSecretKey,
  getPublicKey,
  nip19,
  SimplePool,
} from "nostr-tools";

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
  const relays = ["wss://relay.damus.io"];
  return nip19.nprofileEncode({ pubkey: pk, relays });
}
