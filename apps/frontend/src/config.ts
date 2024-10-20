import { Inter } from "next/font/google";
import { RouterItem } from "@/lib/frontend/types";
import { Icons } from "@/components/Icons";

export const fontBase = Inter({ subsets: ["latin"], variable: "--font-base" });

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const APP_CONFIG = {
  APP_NAME: "Cursive Connections",
  APP_DESCRIPTION: "Cursive Connections",
  SUPPORT_EMAIL: "hello@cursive.team",
  ALLOW_INCOGNITO: false, // Set to false to disable incognito mode
  IS_MOBILE_ONLY: true, // Set to true to disable the web version
  FOOTER_ICON_SIZE: 10,
};

export const ROUTER_ITEMS: RouterItem[] = [
  {
    label: "Narrowcast",
    href: "/narrowcast",
    icon: Icons.NarrowCast,
    iconSize: 20,
  },
  {
    label: "People",
    href: "/people",
    icon: Icons.People,
    iconSize: 20,
  },
  {
    label: "Community",
    href: "/community",
    icon: Icons.Activity,
    iconSize: 20,
  },
  {
    label: "Profile",
    href: "/profile",
    icon: Icons.Profile,
    iconSize: 20,
  },
];
