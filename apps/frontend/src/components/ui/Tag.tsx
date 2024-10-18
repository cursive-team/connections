import { cn } from "@/lib/frontend/util";
import React, { ReactNode } from "react";
import { IoMdClose as CloseIcon } from "react-icons/io";

type TagProps = {
  text: string;
  emoji?: ReactNode;
  variant?: "default" | "active" | "selected";
  onClick?: () => void;
  closable?: boolean;
};

export const Tag = ({
  text,
  emoji = null,
  variant = "default",
  onClick,
  closable = true,
}: TagProps) => {
  return (
    <span
      onClick={() => {
        onClick?.();
      }}
      className={cn(
        "relative inline-flex items-center rounded-full pl-4 pr-6 py-2 text-sm font-medium",
        variant === "selected" && "border border-primary text-primary",
        variant === "default" &&
          "bg-transparent border border-quaternary text-quaternary",
        variant === "active" &&
          "border border-transparent bg-[#FF9DF8] text-secondary"
      )}
    >
      <span className="mr-1">{emoji}</span>
      {text}
      {variant === "active" && closable && (
        <>
          <CloseIcon className="absolute right-[8px]" />
        </>
      )}
    </span>
  );
};
