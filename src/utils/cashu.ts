import { PaymentRequest, PaymentRequestPayload, Proof } from "@cashu/cashu-ts";

export function getProofsTotalAmount(p: Proof[]) {
  return p.reduce((a, c) => a + c.amount, 0);
}

export function isValidPaymentRequestPayload(
  payload: PaymentRequestPayload,
  pr: PaymentRequest,
) {
  console.log(payload.id);
  console.log(pr.id);
  if (pr.id !== payload.id) {
    return false;
  }
  if (pr!.amount! > getProofsTotalAmount(payload.proofs)) {
    return false;
  }
  if (!pr.mints?.includes(payload.mint)) {
    return false;
  }
  return true;
}
