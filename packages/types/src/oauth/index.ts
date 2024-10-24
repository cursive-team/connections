import {z} from "zod";
import {ChipIssuer, LeaderboardEntrySchema, LeaderboardEntryType, LeaderboardEntryTypeSchema} from "../chip";
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
  scope: z.string(),
  token_type: z.string(),
  refresh_token: z.string(),
  user_id: z.number(),
  expires_at: z.number(),
});

export type AccessToken = z.infer<typeof AccessTokenSchema>;

export const DataOptionSchema = z.object({
  type: LeaderboardEntryTypeSchema,
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
    user_id: id,

    // Unused for now, should probably add them
    scope: "",
    token_type: ""
  }
}

export async function githubMapResponseToAccessToken(resp: globalThis.Response): Promise<AccessToken> {
  const data = await resp.json();

  // Convert StravaBearerToken into generic AuthToken
  const parsedData = GithubBearerTokenSchema.parse(data);
  const { access_token, scope, token_type } = parsedData;

  return {
    access_token,
    scope,
    token_type,

    // Unused for now, should probably add them
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