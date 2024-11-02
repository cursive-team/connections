import { Inter } from "next/font/google";
import { RouterItem } from "@/lib/frontend/types";
import { Icons } from "@/components/icons/Icons";
import {
  ImportDataType,
  OAuthAppDetails
} from "@types";

export const fontBase = Inter({ subsets: ["latin"], variable: "--font-base" });

export const FRONTEND_URL =
  process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000";

export const BASE_API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const SOCIAL_LAYER_GROUP_IDS: Record<string, number> = {
  "EDGE_CITY_LANNA": 3463, // HERE: should this be listed like this in a public repo? It is a public API though
}

export const OAUTH_APP_DETAILS: Record<string, OAuthAppDetails> = {
  strava: {
    client_side_fetching: true,
    need_token: true,
    can_import: true,
    token_url: "https://www.strava.com/api/v3/oauth/token",
    redirect_uri: `${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`,
    id: process.env.NEXT_PUBLIC_OAUTH_STRAVA_CLIENT_ID || "",
    secret: process.env.NEXT_PUBLIC_OAUTH_STRAVA_CLIENT_SECRET || "",
    data_options: [
      {
        type: ImportDataType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE,
        scope: "read",
      },
    ],
  },
  github: {
    client_side_fetching: false,
    need_token: true,
    can_import: true,
    token_url: "https://github.com/login/oauth/access_token",
    redirect_uri: `${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`,
    id: process.env.NEXT_PUBLIC_OAUTH_GITHUB_CLIENT_ID || "",
    secret: "",
    data_options: [
      {
        type: ImportDataType.GITHUB_LANNA_COMMITS,
        scope: "read",
      },
    ],
  },
  social_layer: {
    client_side_fetching: true,
    need_token: false,
    can_import: true,
    token_url: "", // No auth
    redirect_uri: "", // No auth means no need to auth, just directly import
    id: "",
    secret: "",
    data_options: [
      // TODO: add setting for how frequently to import -- ONCE, PER_RELOAD, PER_DAY
      {
        type: ImportDataType.SOCIAL_LAYER_TICKET_ATTENDANCE,
        scope: "read",
        // run: "once"
      },
      {
        type: ImportDataType.SOCIAL_LAYER_USER_GROUPS,
        scope: "read",
        // run: "per_session"
      },
      {
        type: ImportDataType.SOCIAL_LAYER_USER_EVENTS,
        scope: "read",
        // run: "per_session"
      }
    ]
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
    label: "Halloween",
    href: "/halloween",
    icon: Icons.Star,
    iconSize: 20,
  },
  {
    label: "Account",
    href: "/profile",
    icon: Icons.Profile,
    iconSize: 20,
  },
];
