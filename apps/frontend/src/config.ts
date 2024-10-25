import { Inter } from "next/font/google";
import { RouterItem } from "@/lib/frontend/types";
import { Icons } from "@/components/Icons";
import { LeaderboardEntryType, OAuthAppDetails } from "@types";

export const fontBase = Inter({ subsets: ["latin"], variable: "--font-base" });

export const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const OAUTH_APP_DETAILS: Record<string, OAuthAppDetails> = {
  strava: {
    client_side_fetching: true,
    can_import: true,
    token_url: "https://www.strava.com/api/v3/oauth/token",
    redirect_uri: `${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`,
    id: process.env.NEXT_PUBLIC_OAUTH_STRAVA_CLIENT_ID || "",
    secret: process.env.NEXT_PUBLIC_OAUTH_STRAVA_CLIENT_SECRET || "",
    data_options: [
      {
        type: LeaderboardEntryType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE,
        scope: "read",
      },
    ],
  },
  github: {
    client_side_fetching: false,
    can_import: true,
    token_url: "https://github.com/login/oauth/access_token",
    redirect_uri: `${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`,
    id: process.env.NEXT_PUBLIC_OAUTH_GITHUB_CLIENT_ID || "",
    secret: "",
    data_options: [
      {
        type: LeaderboardEntryType.GITHUB_WEEK_OCT_20_COMMITS,
        scope: "read",
      },
    ],
  },
};

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
