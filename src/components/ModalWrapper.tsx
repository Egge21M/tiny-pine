import { ReactNode } from "react";

function ModalWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="inset-0 bg-black opacity-50 fixed " />
      <div className="fixed inset-0 w-full flex justify-center items-center">
        <dialog
          open
          className="flex flex-col justify-center items-center p-8 rounded bg-zinc-100 text-black w-full max-w-sm"
        >
          {children}
        </dialog>
      </div>
    </>
  );
}

export default ModalWrapper;
