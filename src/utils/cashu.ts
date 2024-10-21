import { PaymentRequest, PaymentRequestPayload, Proof } from "@cashu/cashu-ts";

export function getProofsTotalAmount(p: Proof[]) {
  return p.reduce((a, c) => a + c.amount, 0);
}

export function validatePaymentRequestPayload(
  payload: PaymentRequestPayload,
  pr: PaymentRequest,
) {
  if (
    pr.id !== payload.id ||
    pr!.amount! > getProofsTotalAmount(payload.proofs) ||
    !pr.mints?.includes(payload.mint)
  ) {
    throw new Error("Invalid payment payload");
  }
}
