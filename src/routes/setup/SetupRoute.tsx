import { hexToBytes } from "@noble/hashes/utils";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { setSecretKey } from "../../utils/nostr";
import Button from "../../components/Button";
import { LuTreePine } from "react-icons/lu";

function Setup({
  setIsSetup,
}: {
  setIsSetup: Dispatch<SetStateAction<boolean>>;
}) {
  const [isImport, setIsImport] = useState(false);

  const word1 = useRef<HTMLInputElement>(null);
  const word2 = useRef<HTMLInputElement>(null);
  const word3 = useRef<HTMLInputElement>(null);
  const word4 = useRef<HTMLInputElement>(null);
  const word5 = useRef<HTMLInputElement>(null);
  const word6 = useRef<HTMLInputElement>(null);
  const word7 = useRef<HTMLInputElement>(null);
  const word8 = useRef<HTMLInputElement>(null);
  const word9 = useRef<HTMLInputElement>(null);
  const word10 = useRef<HTMLInputElement>(null);
  const word11 = useRef<HTMLInputElement>(null);
  const word12 = useRef<HTMLInputElement>(null);

  const refArr = [
    word1,
    word2,
    word3,
    word4,
    word5,
    word6,
    word7,
    word8,
    word9,
    word10,
    word11,
    word12,
  ];

  if (isImport) {
    return (
      <main className="flex flex-col items-center justify-center p-4 gap-4">
        <h1>TINYPINE</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <input
                className="bg-zinc-200 p-2 rounded"
                placeholder={String(i + 1)}
                ref={refArr[i]}
              />
            ))}
        </div>
        <div className="flex gap-2">
          <Button
            title="Back"
            onClick={() => {
              setIsImport(false);
            }}
          />
          <Button
            title="Confirm"
            onClick={async () => {
              const mnemArr = [
                word1.current?.value,
                word2.current?.value,
                word3.current?.value,
                word4.current?.value,
                word5.current?.value,
                word6.current?.value,
                word7.current?.value,
                word8.current?.value,
                word9.current?.value,
                word10.current?.value,
                word11.current?.value,
                word12.current?.value,
              ];
              const { privateKeyFromSeedWords } = await import(
                "nostr-tools/nip06"
              );
              const mnemString = JSON.stringify(mnemArr);
              localStorage.setItem("tiny-mnem", mnemString);
              const key = privateKeyFromSeedWords(mnemArr.join(" "));
              const sk = hexToBytes(key);
              setSecretKey(sk);
              setIsSetup(true);
            }}
          />
        </div>
      </main>
    );
  }
  return (
    <main className="absolute inset-0 flex flex-col gap-4 justify-center items-center">
      <div className="flex gap-2 text-2xl items-center">
        <LuTreePine />
        <h1>TINYPINE</h1>
      </div>
      <div className="flex gap-4">
        <div>
          <Button
            title="Start fresh"
            onClick={async () => {
              const { generateSeedWords, privateKeyFromSeedWords } =
                await import("nostr-tools/nip06");
              const words = generateSeedWords();
              localStorage.setItem(
                "tiny-mnem",
                JSON.stringify(words.split(" ")),
              );
              console.log(words);
              const key = privateKeyFromSeedWords(words);
              const sk = hexToBytes(key);
              setSecretKey(sk);
              setIsSetup(true);
            }}
          />
        </div>
        <div>
          <Button
            title="Import backup"
            onClick={() => {
              setIsImport(true);
            }}
          />
        </div>
      </div>
    </main>
  );
}

export default Setup;
