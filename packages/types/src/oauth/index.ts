import {z} from "zod";
import {ChipIssuer, LeaderboardType, LeaderboardTypeSchema} from "../chip";
import {LeaderboardEntry} from "../chip";

export const StravaAtheleteSchema = z.object({
  id: z.number(),
});

export type StravaAthelete = z.infer<typeof StravaAtheleteSchema>;

export const StravaBearerTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
  athlete: StravaAtheleteSchema,
});

export type StravaBearerToken = z.infer<typeof StravaBearerTokenSchema>;

export const GithubBearerTokenSchema = z.object({
  access_token: z.string(),
  scope: z.string(),
  token_type: z.string(),
});

export type GithubBearerToken = z.infer<typeof GithubBearerTokenSchema>;

export const AccessTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user_id: z.number(),
  // TODO: add username for github
  expires_at: z.number(), // TODO change to date
});

export type AccessToken = z.infer<typeof AccessTokenSchema>;

export const DataOptionSchema = z.object({
  type: LeaderboardTypeSchema,
  endpoint: z.string(),
});

export type DataOption = z.infer<typeof DataOptionSchema>;

export const OAuthMappingSchema = z.object({
  client_side_fetching: z.boolean(),
  redirect_uri: z.string(),
  id: z.string(),
  secret: z.string(),
  token_url: z.string(),
  data_options: z.array(DataOptionSchema),
});

export type OAuthMapping = z.infer<typeof OAuthMappingSchema>;

export const OAuthExchangeTokensRequestSchema = z.object({
  code: z.string(),
  state: z.string(),
});

export type OAuthExchangeTokensRequest = z.infer<
  typeof OAuthExchangeTokensRequestSchema
>;

// Mapping access token types

export async function stravaMapResponseToAccessToken(resp: globalThis.Response): Promise<AccessToken> {
  const data = await resp.json();

  // Convert StravaBearerToken into generic AuthToken
  const parsedData = StravaBearerTokenSchema.parse(data);
  const { access_token, refresh_token, expires_at, athlete } = parsedData;
  const { id } = athlete;

  return {
    access_token,
    refresh_token,
    expires_at,
    user_id: id
  }
}

export async function githubMapResponseToAccessToken(resp: globalThis.Response): Promise<AccessToken> {
  const data = await resp.json();

  // Convert StravaBearerToken into generic AuthToken
  const parsedData = GithubBearerTokenSchema.parse(data);
  const { access_token, } = parsedData;

  return {
    access_token: access_token,
    refresh_token: "",
    expires_at: 0,
    user_id: 0
  }
}

export const STRAVA = "strava";
export const GITHUB = "github";

export async function mapResponseToAccessToken(app: string, resp: globalThis.Response): Promise<AccessToken | null> {
  switch(app) {
    case STRAVA:
      return await stravaMapResponseToAccessToken(resp);
    case GITHUB:
      return await githubMapResponseToAccessToken(resp);
    default:
      return null;
  }
}

// Import related types

export function StravaFormatEndpoint(token: AccessToken, endpoint: string): string {
  return endpoint.replace("${user_id}", String(token.user_id));
}

export const StravaRecentRunSchema = z.object({
  distance: z.number(),
});

export const StravaActivityRunStatsSchema = z.object({
  recent_run_totals: StravaRecentRunSchema,
})

export type StravaActivityRunStats = z.infer<typeof StravaActivityRunStatsSchema>;

export function MapStravaActivityStatsToLeaderboardEntry(username: string, chipIssuer: ChipIssuer, resp: any): LeaderboardEntry {
  const parsed = StravaActivityRunStatsSchema.parse(resp);
  return {
    username: username,
    chipIssuer: chipIssuer,
    value: parsed.recent_run_totals.distance,
    type: LeaderboardType.STRAVA_MONTHLY_RUN,
    tapCount: 0,
  }
}

export function MapResponseToLeaderboardEntry(username: string, type: LeaderboardType, chipIssuer: ChipIssuer, resp: any): LeaderboardEntry | null {
  switch(type) {
    case LeaderboardType.STRAVA_MONTHLY_RUN:
      return MapStravaActivityStatsToLeaderboardEntry(username, chipIssuer, resp);
    default:
      // Probably should throw error
      return null;
  }
}