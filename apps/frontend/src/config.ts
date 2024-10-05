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
    label: "Home",
    href: "/",
    icon: Icons.Home,
    iconSize: 20,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Icons.Settings,
    iconSize: 20,
  },
  {
    label: "Components",
    href: "/components",
    icon: Icons.Profile,
    iconSize: 20,
  },
];
