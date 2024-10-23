import {
  AccessToken,
  AccessTokenSchema,
  OAuthMapping,
  mapResponseToAccessToken,
  STRAVA,
} from "@types";
import {
  BASE_API_URL,
  OAUTH_APP_MAPPING,
} from "@/config";


async function fetchToken(app: string, mapping: OAuthMapping, code: string): Promise<Response | null> {
  // Apps that use client-side fetching
  switch(app) {
    case STRAVA:
      return await stravaFetchToken(mapping, code);
    default:
      return null;
  }
}


async function stravaFetchToken(mapping: OAuthMapping, code: string): Promise<Response> {
  const { id, secret, token_url } = mapping;

  return fetch(
    token_url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: id,
        client_secret: secret,
        code: code,
        grant_type: "authorization_code"
      }),
    }
  );
}

export async function getOAuthTokenViaClient(
  code: string,
  app: string,
): Promise<AccessToken | null> {
  try {
    if (!OAUTH_APP_MAPPING[app]) {
      throw new Error("OAuth app integration details are not available");
    }

    const mapping: OAuthMapping = OAUTH_APP_MAPPING[app];

    const response = await fetchToken(app, mapping, code);
    if (!response) {
      throw new Error("OAuth access token response is null");
    }

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
    }

    // Convert app-specific token format into generic AccessToken
    const accessToken = await mapResponseToAccessToken(app, response)
    return accessToken || null;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}

export async function getOAuthTokenViaServer(
  code: string,
  state: string
): Promise<AccessToken> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/oauth/access_token?code=${code}&state=${state}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorResponse = await response.json();
      console.error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
    }

    const data = await response.json();
    return AccessTokenSchema.parse(data);
  } catch (error) {
    console.error("Error getting oauth access:", error);
    throw error;
  }
}