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

export const AccessTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  user_id: z.number(),
  expires_at: z.number(), // TODO change to date
});

export type AccessToken = z.infer<typeof AccessTokenSchema>;

export function MapStravaToAccessToken(stravaToken: StravaBearerToken) : AccessToken {
  return {
    access_token: stravaToken.access_token,
    refresh_token: stravaToken.refresh_token,
    expires_at: stravaToken.expires_at,
    user_id: stravaToken.athlete.id,
  }
}

export const DataOptionSchema = z.object({
  type: LeaderboardTypeSchema,
  endpoint: z.string(),
});

export type DataOption = z.infer<typeof DataOptionSchema>;

export const OAuthMappingSchema = z.object({
  id: z.string(),
  secret: z.string(),
  token_url: z.string(),
  data_options: z.array(DataOptionSchema),
});

export type OAuthMapping = z.infer<typeof OAuthMappingSchema>;

export function FormatEndpoint(token: AccessToken, endpoint: string): string {
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