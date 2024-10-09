import Link from "next/dist/client/link";
import * as React from "react";
import { RouterItem } from "@/lib/frontend/types";
import { cn } from "@/lib/frontend/util";
import { classed } from "@tw-classed/react";

export const MenuBarItem = ({ label, href, isActive, icon }: RouterItem) => {
  // @ts-ignore
  const Icon: any = icon;

  const iconColor = isActive ? "text-icon-primary" : "text-icon-tertiary";

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex flex-col text-center gap-1 justify-center text-sm font-inter font-medium text-primary mt-auto leading-5 py-1 px-3 rounded-[4px] opacity-50",
          isActive && "!opacity-100"
        )}
      >
        <Icon size={24} className={cn("duration-200 mx-auto", iconColor)} />
        <span className="text-center text-xs font-medium leading-4">
          {label}
        </span>
      </div>
    </Link>
  );
};

export const MenuBar = classed.div(
  "flex flex-col p-[1px] border border-t-stroke-secondary bg-surface-primary"
);
