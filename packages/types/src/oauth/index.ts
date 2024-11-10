import { z } from "zod";

import { DataImportSource, DataImportSourceSchema } from "../imports";

// Export app-specific types
export * from "./strava";
export * from "./github";

export const StravaAtheleteSchema = z.object({
  id: z.number(),
});

export type StravaAthelete = z.infer<typeof StravaAtheleteSchema>;

export const StravaBearerTokenSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  expires_at: z.number(),
  athlete: StravaAtheleteSchema.optional(),
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

export const OAuthExchangeTokensRequestSchema = z.object({
  code: z.string(),
  state: DataImportSourceSchema,
});

export type OAuthExchangeTokensRequest = z.infer<
  typeof OAuthExchangeTokensRequestSchema
>;

// Mapping access token types
export async function stravaMapResponseToAccessToken(
  data: any,
  oldAccessToken: AccessToken | null,
): Promise<AccessToken> {
  // Convert StravaBearerToken into generic AuthToken
  const parsedData = StravaBearerTokenSchema.parse(data);
  const { access_token, refresh_token, expires_at, athlete } = parsedData;

  let id: number = 0;
  if (!athlete && oldAccessToken) {
    // Athlete not available, means we're in the refresh flow. Use existing value.
    id = oldAccessToken.user_id;
  } else if (athlete) {
    // Athlete available, use it
    id = athlete.id;
  } else {
    throw new Error("Required user Id output is missing.")
  }

  return {
    access_token,
    refresh_token,
    expires_at,
    user_id: id,

    // Unused for now, should probably add them
    scope: "",
    token_type: "",
  };
}

export async function githubMapResponseToAccessToken(
  data: any
): Promise<AccessToken> {
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
    user_id: 0,
  };
}

export async function mapResponseToAccessToken(
  app: DataImportSource,
  oldAccessToken: AccessToken | null, // Used in refresh case
  data: any
): Promise<AccessToken | null> {
  switch (app) {
    case DataImportSource.STRAVA:
      return await stravaMapResponseToAccessToken(data, oldAccessToken);
    case DataImportSource.GITHUB:
      return await githubMapResponseToAccessToken(data);
    default:
      return null;
  }
}
