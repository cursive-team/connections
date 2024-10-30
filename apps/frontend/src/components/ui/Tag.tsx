import { classed } from "@tw-classed/react";
import React, { ReactNode } from "react";
import { IoMdClose as CloseIcon } from "react-icons/io";
import { Icons } from "../Icons";
import { cn } from "@/lib/frontend/util";

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
  fullWidth?: boolean;
  refresh?: boolean;
};

const TagBase = classed.div(
  "relative inline-flex items-center rounded-full pl-2 pr-6 py-2 text-sm font-medium",
  {
    variants: {
      variant: {
        selected: "border border-primary text-primary",
        default: "bg-transparent border border-quaternary text-quaternary",
        active: "border border-transparent bg-[#FF9DF8] text-primary",
        gray: "border border-transparent bg-[#F1F1F1] text-primary",
        transparent: "bg-transparent",
      },
      fullWidth: {
        true: "justify-center pr-2",
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
  fullWidth = false,
  refresh = false,
}: TagProps) => {
  return (
    <TagBase
      className={className}
      variant={variant}
      fullWidth={fullWidth}
      onClick={() => {
        onClick?.();
      }}
    >
      <span className="mr-2">{emoji}</span>
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
          <Icons.Plus
            size={16}
            className={cn(fullWidth ? "ml-2" : "absolute right-[8px]")}
          />
        </>
      )}
      {remove && (
        <>
          <Icons.Remove
            className={cn(fullWidth ? "ml-2" : "absolute right-[8px]")}
          />
        </>
      )}
      {refresh && (
        <>
          <Icons.Refresh className="absolute right-[8px]" />
        </>
      )}
    </TagBase>
  );
};
