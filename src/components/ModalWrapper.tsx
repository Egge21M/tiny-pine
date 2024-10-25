import { ReactNode } from "react";

function ModalWrapper({
  children,
  onBdClick,
}: {
  children: ReactNode;
  onBdClick?: () => void;
}) {
  return (
    <>
      <div className="inset-0 bg-black opacity-50 fixed " onClick={onBdClick} />
      <div
        className="fixed inset-0 w-full flex justify-center items-center"
        onClick={onBdClick}
      >
        <dialog
          open
          className="flex flex-col justify-center items-center p-8 rounded bg-zinc-100 text-black w-full max-w-sm shadow-2xl"
        >
          {children}
        </dialog>
      </div>
    </>
  );
}

export default ModalWrapper;
