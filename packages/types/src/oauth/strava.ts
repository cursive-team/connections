import {z} from "zod";
import {ChipIssuer, LeaderboardEntry, LeaderboardEntryType} from "../chip";
import {AccessToken} from "./index";

export const StravaAtheleteSchema = z.object({
  id: z.number(),
});

export type StravaAthelete = z.infer<typeof StravaAtheleteSchema>;

export const StravaBearerTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
  token_type: z.string(),
  athlete: StravaAtheleteSchema,
});

export type StravaBearerToken = z.infer<typeof StravaBearerTokenSchema>;

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
    entryValue: parsed.recent_run_totals.distance,
    entryType: LeaderboardEntryType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE,
  }
}
