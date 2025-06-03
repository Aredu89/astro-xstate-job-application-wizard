import type { JSX } from "solid-js";

interface ButtonProps {
  class?: string;
  onClick?: JSX.EventHandlerUnion<HTMLButtonElement, MouseEvent>;
  children?: JSX.Element;
  type?: "button" | "submit" | "reset";
}

export default function Button({ class: className = "", onClick, children, type = "button" }: ButtonProps) {
  return (
    <button class={`px-4 py-2 rounded ${className} cursor-pointer`} onClick={onClick} type={type}>
      {children}
    </button>
  );
}