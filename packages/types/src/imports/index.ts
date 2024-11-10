import { z } from "zod";

export enum DataImportSource {
  STRAVA = "strava",
  GITHUB = "github",
  SPOTIFY = "spotify"
}

export const DataImportSourceSchema = z.nativeEnum(DataImportSource)

export enum ImportDataType {
  STRAVA_PREVIOUS_MONTH_RUN_DISTANCE = "STRAVA_PREVIOUS_MONTH_RUN_DISTANCE",
  GITHUB_LANNA_CONTRIBUTIONS = "GITHUB_LANNA_CONTRIBUTIONS",
  GITHUB_CONTRIBUTIONS_LAST_YEAR = "GITHUB_CONTRIBUTIONS_LAST_YEAR",
  GITHUB_STARRED_REPOS = "GITHUB_STARRED_REPOS",
  GITHUB_PROGRAMMING_LANGUAGES = "GITHUB_PROGRAMMING_LANGUAGES",

  // Import options:
  SPOTIFY_STUB = "SPOTIFY_STUB"

  // Leaderboard options:
  // 

}

export const ImportDataTypeSchema = z.nativeEnum(ImportDataType);

export enum RefreshRateType {
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  TESTING = "TESTING"
}

export const RefreshRateTypeSchema = z.nativeEnum(RefreshRateType);

export const DataOptionSchema = z.object({
  type: ImportDataTypeSchema,
  scope: z.string(),
  refreshRate: RefreshRateTypeSchema,
});

export type DataOption = z.infer<typeof DataOptionSchema>;

export const OAuthAppDetailsSchema = z.object({
  client_side_fetching: z.boolean(),
  can_import: z.boolean(),
  redirect_uri: z.string(),
  id: z.string(),
  secret: z.string(),
  token_url: z.string(),
  data_options: z.array(DataOptionSchema),
});

export type OAuthAppDetails = z.infer<typeof OAuthAppDetailsSchema>;