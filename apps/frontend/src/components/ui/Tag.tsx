import { classed } from "@tw-classed/react";
import React, { ReactNode } from "react";
import { IoMdClose as CloseIcon } from "react-icons/io";
import { Icons } from "../Icons";

type TagProps = {
  text: string;
  className?: string;
  emoji?: ReactNode;
  variant?: "default" | "active" | "selected" | "gray" | "transparent";
  onClick?: () => void;
  closable?: boolean;
  external?: boolean;
  remove?: boolean;
  addElement?: boolean;
};

const TagBase = classed.div(
  "relative inline-flex items-center rounded-full pl-4 pr-6 py-2 text-sm font-medium",
  {
    variants: {
      variant: {
        selected: "border border-primary text-primary",
        default: "bg-transparent border border-quaternary text-quaternary",
        active: "border border-transparent bg-[#FF9DF8] text-primary",
        gray: "border border-transparent bg-[#F1F1F1] text-primary",
        transparent: "bg-transparent",
      },
    },
  }
);
export const Tag = ({
  text,
  className = "",
  emoji = null,
  variant = "default",
  onClick,
  closable = true,
  external = false,
  addElement = false,
  remove = false,
}: TagProps) => {
  return (
    <TagBase
      className={className}
      variant={variant}
      onClick={() => {
        onClick?.();
      }}
    >
      <span className="mr-1">{emoji}</span>
      {text}
      {variant === "active" && closable && (
        <>
          <CloseIcon className="absolute right-[8px]" />
        </>
      )}
      {external && (
        <>
          <Icons.ExternalLink className="absolute right-[8px]" />
        </>
      )}
      {addElement && (
        <>
          <Icons.Plus className="absolute right-[8px]" />
        </>
      )}
      {remove && (
        <>
          <Icons.Remove className="absolute right-[8px]" />
        </>
      )}
    </TagBase>
  );
};
