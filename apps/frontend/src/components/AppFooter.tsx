"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ROUTER_ITEMS } from "@/config";
import { MenuBar, MenuBarItem } from "./ui/MenuBar";
import useSettings from "@/hooks/useSettings";
import { cn } from "@/lib/frontend/util";

const AppFooter = () => {
  const pathname = usePathname();
  const { darkTheme } = useSettings();
  return (
    <footer
      id="footer"
      className={cn(
        "fixed w-full bottom-0 z-[50] overflow-hidden p-[10px] pb-[20px]"
      )}
    >
      <div
        className={cn("", darkTheme ? "bg-white" : "bg-black")}
        style={{
          borderRadius: "48px",
        }}
      >
        <MenuBar
          className="md:container overflow-hidden grid bottom-0 w-full py-2 xs:pt-[17px] xs:pb-[13px] border-r-0 border-l-0 border-b-0"
          darkTheme={darkTheme}
          style={{
            gridTemplateColumns: `repeat(${ROUTER_ITEMS.length}, 1fr)`,
            borderRadius: "48px",
            boxShadow: darkTheme
              ? "0px 4px 4px 0px rgba(255, 2550, 255, 0.25)"
              : "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
        >
          {ROUTER_ITEMS.map((route, index) => {
            const pathParts = route.href.split("/").filter(Boolean);
            const isHome = pathname === "/" && route.href === "/";

            // is home or the first part of the path matches the first part of the href
            const isActive =
              index === 0 ||
              isHome ||
              (pathname !== null && pathParts[0] === pathname.split("/")[1]);

            return <MenuBarItem key={index} {...route} isActive={isActive} />;
          })}
        </MenuBar>
      </div>
    </footer>
  );
};

AppFooter.displayName = "AppFooter";
export { AppFooter };
