import { Inter } from "next/font/google";
import { RouterItem } from "@/lib/frontend/types";
import { Icons } from "@/components/Icons";
import {
  LeaderboardType,
  OAuthMapping
} from "@types";

export const fontBase = Inter({ subsets: ["latin"], variable: "--font-base" });

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const OAUTH_APP_MAPPING: Record<string, OAuthMapping> = {
  "strava": {
    client_side_fetching: true,
    token_url: "https://www.strava.com/api/v3/oauth/token",
    redirect_uri: "http://localhost:3000/oauth/exchange_token&approval_prompt=force&scope=read", // TODO: update for prod, set correct scopes for each service -- definitely should have app-level separation for app-specific scopes,
    id: process.env.NEXT_PUBLIC_OAUTH_STRAVA_CLIENT_ID || "",
    secret: process.env.NEXT_PUBLIC_OAUTH_STRAVA_CLIENT_SECRET || "",
    data_options: [
      {
        type: LeaderboardType.STRAVA_MONTHLY_RUN,
        endpoint: "https://www.strava.com/api/v3/athletes/${user_id}/stats", // TODO: move within function?
      }
    ],
  },
  "github": {
    client_side_fetching: false,
    token_url: "https://github.com/login/oauth/access_token",
    redirect_uri: "http://localhost:3000/oauth/exchange_token&approval_prompt=force&scope=read",
    id: process.env.NEXT_PUBLIC_OAUTH_GITHUB_CLIENT_ID || "",
    secret: process.env.NEXT_PUBLIC_OAUTH_GITHUB_CLIENT_SECRET || "",
    data_options: [
      {
        type: LeaderboardType.GITHUB_MONTHLY_PROJECT_COMMITS,
        endpoint: "",
      }
    ],
  }
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
