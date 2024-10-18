import React, { MouseEventHandler } from "react";

type ButtonProps = {
  title: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
};

function Button({ title, onClick }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="py-1 px-2 border-black border-[1px] rounded bg-zinc-50 active:bg-zinc-300 hover:bg-zinc-200"
    >
      {title}
    </button>
  );
}

export default Button;
