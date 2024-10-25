import { useState } from "react";
import Button from "../../components/Button";
import useBalance from "../../hooks/useBalance.";
import { getEncodedToken } from "@cashu/cashu-ts";
import AnimatedQrCode from "../../components/AnimatedQrCode";

function WalletRoute() {
  const proofs = useBalance();
  const balance = proofs.reduce((a, c) => a + c.amount, 0);
  const [withdrawToken, setWithdrawToken] = useState("");
  const [error, setError] = useState("");

  async function withdrawHandler() {
    setError("");
    if (proofs.length === 0) {
      setError("no proofs to claim!");
      return;
    }
    const mintUrl = "https://nofees.testnut.cashu.space";
    try {
      const token = getEncodedToken({ token: [{ mint: mintUrl, proofs }] });
      setWithdrawToken(token);
    } catch (e) {
      console.error(e);
      setError("failed to swap proofs");
    }
  }
  return (
    <main className="grow p-4 flex flex-col items-start gap-4">
      <h1>Wallet</h1>
      <div className="p-4 bg-zinc-100 shadow">
        <p className="text-2xl flex gap-1">
          <span className="text-5xl font-bold">{balance}</span> SATS
        </p>
        <p>{proofs.length} Proofs waiting</p>
      </div>
      <Button title="Withdraw to Cashu Wallet" onClick={withdrawHandler} />
      {withdrawToken ? <AnimatedQrCode value={withdrawToken} /> : undefined}
      {error ? <p className="text-red-500">{error}</p> : undefined}
    </main>
  );
}

export default WalletRoute;
