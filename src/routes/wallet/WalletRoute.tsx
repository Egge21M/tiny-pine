import useBalance from "../../hooks/useBalance.";

function WalletRoute() {
  const balance = useBalance();
  return (
    <main>
      <h1>Wallet</h1>
      <p>{balance} SATS</p>
    </main>
  );
}

export default WalletRoute;
