"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { ROUTER_ITEMS } from "@/config";
import { MenuBar, MenuBarItem } from "./ui/MenuBar";

const AppFooter = () => {
  const pathname = usePathname();

  return (
    <footer
      id="footer"
      className="fixed w-full bottom-0 z-[50] bg-surface-primary"
    >
      <MenuBar
        className="md:container grid bottom-0 py-3 xs:pt-[17px] xs:pb-[13px]"
        style={{
          gridTemplateColumns: `repeat(${ROUTER_ITEMS.length}, 1fr)`,
        }}
      >
        {ROUTER_ITEMS.map((route, index) => {
          const pathParts = route.href.split("/").filter(Boolean);
          const isHome = pathname === "/" && route.href === "/";

          // is home or the first part of the path matches the first part of the href
          const isActive =
            isHome ||
            (pathname !== null && pathParts[0] === pathname.split("/")[1]);

          return <MenuBarItem key={index} {...route} isActive={isActive} />;
        })}
      </MenuBar>
    </footer>
  );
};

AppFooter.displayName = "AppFooter";
export { AppFooter };
