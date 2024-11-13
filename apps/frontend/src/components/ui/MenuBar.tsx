import Link from "next/dist/client/link";
import * as React from "react";
import { RouterItem } from "@/lib/frontend/types";
import { cn } from "@/lib/frontend/util";
import { classed } from "@tw-classed/react";
import useSettings from "@/hooks/useSettings";

export const MenuBarItem = ({ href, isActive, icon, iconSize }: RouterItem) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const Icon: any = icon;
  const { darkTheme } = useSettings();

  const iconColor = darkTheme ? "text-black" : "text-white";

  return (
    <Link href={href}>
      <div
        className={cn(
          "flex flex-col text-center duration-200 gap-1 justify-center text-sm font-sans font-medium text-label-primary mt-auto leading-5 py-1 px-3 rounded-[4px] opacity-50",
          isActive && "!opacity-100"
        )}
      >
        <Icon
          size={iconSize}
          className={cn(
            "duration-200 mx-auto opacity-100",
            iconColor,
            isActive && "!opacity-100"
          )}
        />
      </div>
    </Link>
  );
};

export const MenuBar = classed.div(
  "flex flex-col p-[1px] border border-t-stroke-secondary",
  {
    variants: {
      darkTheme: {
        true: "bg-white",
        false: "bg-black",
      },
    },
  }
);
