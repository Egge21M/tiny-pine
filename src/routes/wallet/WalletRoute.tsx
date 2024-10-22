import useBalance from "../../hooks/useBalance.";

function WalletRoute() {
  const balance = useBalance();
  return (
    <main className="grow p-4">
      <h1>Wallet</h1>
      <p>{balance} SATS</p>
    </main>
  );
}

export default WalletRoute;
