import { ImportDataType, OAuthAppDetails } from "@types";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export const OAUTH_APP_DETAILS: Record<string, OAuthAppDetails> = {
  strava: {
    client_side_fetching: true,
    can_import: true,
    token_url: "https://www.strava.com/api/v3/oauth/token",
    redirect_uri: `${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`,
    id: process.env.OAUTH_STRAVA_CLIENT_ID || "",
    secret: process.env.OAUTH_STRAVA_CLIENT_SECRET || "",
    data_options: [],
  },
  github: {
    client_side_fetching: false,
    can_import: true,
    token_url: "https://github.com/login/oauth/access_token",
    redirect_uri: `${FRONTEND_URL}/oauth/exchange_token&approval_prompt=force&scope=read`,
    id: process.env.OAUTH_GITHUB_CLIENT_ID || "",
    secret: process.env.OAUTH_GITHUB_CLIENT_SECRET || "",
    data_options: [],
  },
};
