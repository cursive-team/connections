import {LeaderboardType, OAuthMapping} from "@types";

export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

export const OAUTH_APP_MAPPING: Record<string, OAuthMapping> = {
  "strava": {
    client_side_fetching: true,
    token_url: "https://www.strava.com/api/v3/oauth/token",
    redirect_uri: "http://localhost:3000/oauth/exchange_token&approval_prompt=force&scope=read",
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
