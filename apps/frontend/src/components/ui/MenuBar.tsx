import Link from "next/dist/client/link";
import * as React from "react";
import { RouterItem } from "@/lib/frontend/types";
import { cn } from "@/lib/frontend/util";
import { classed } from "@tw-classed/react";

export const MenuBarItem = ({ label, href, isActive }: RouterItem) => {
  return (
    <Link href={href}>
      <div
        className={cn(
          "flex text-center justify-center text-sm font-inter font-medium text-primary mt-auto leading-5 py-[6px] px-3 rounded-[4px]",
          isActive && "border border-stroke-secondary bg-surface-quaternary  "
        )}
      >
        {label}
      </div>
    </Link>
  );
};

export const MenuBar = classed.div(
  "flex flex-col rounded-[6px] p-[1px] border border-stroke-secondary bg-surface-primary"
);
