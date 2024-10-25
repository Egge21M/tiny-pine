import QRCode from "react-qr-code";
import { useQRParts } from "../hooks/useQrParts";

function AnimatedQrCode({ value }: { value: string }) {
  const part = useQRParts(true, true, value);
  return <QRCode value={part} />;
}

export default AnimatedQrCode;
