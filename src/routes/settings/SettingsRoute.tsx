import { useMemo, useState } from "react";
import Button from "../../components/Button";

const placeholder = Array(12).fill("****");

function SettingsRoute() {
  const [showMnem, setShowMnem] = useState(false);
  const mnem = useMemo(() => {
    return JSON.parse(localStorage.getItem("tiny-mnem")!);
  }, []);
  return (
    <main className="grow flex-col p-2 gap-2">
      <h1>Settings</h1>
      <div className="flex gap-2">
        <input
          value={showMnem ? mnem.join(" ") : placeholder.join(" ")}
          className="bg-zinc-200 p-2 rounded grow max-w-md"
        />
        <Button
          title={showMnem ? "Hide" : "Show"}
          onClick={() => {
            setShowMnem((p) => !p);
          }}
        />
        <Button
          title="Copy"
          onClick={() => {
            navigator.clipboard.writeText(mnem.join(" "));
          }}
        />
      </div>
    </main>
  );
}

export default SettingsRoute;
