import {
  AccessToken,
  AccessTokenSchema,
  OAuthAppDetails,
  mapResponseToAccessToken,
  STRAVA,
} from "@types";
import {
  BASE_API_URL,
  OAUTH_APP_DETAILS,
} from "@/config";


async function fetchToken(app: string, mapping: OAuthAppDetails, code: string): Promise<Response | null> {
  // Apps that use client-side fetching
  switch(app) {
    case STRAVA:
      return await stravaFetchToken(mapping, code);
    default:
      return null;
  }
}

async function stravaFetchToken(mapping: OAuthAppDetails, code: string): Promise<Response> {
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
  app: string,
  code: string,
): Promise<AccessToken | null> {
  try {
    if (!OAUTH_APP_DETAILS[app]) {
      throw new Error("OAuth app integration details are not available");
    }

    const mapping: OAuthAppDetails = OAUTH_APP_DETAILS[app];

    const response = await fetchToken(app, mapping, code);
    if (!response) {
      throw new Error("OAuth access token response is null");
    }

    if (!response.ok || response.type == "error") {
      const errorResponse = await response.json();
      console.error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorResponse.error}`
      );
    }

    const data = await response.json();
    if (data && data.error) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${data.error}, consider checking environment variables or redirect_uri`
      );
    }

    // Convert app-specific token format into generic AccessToken
    return await mapResponseToAccessToken(app, data)
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}

export async function getOAuthTokenViaServer(
  app: string,
  code: string,
): Promise<AccessToken> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/oauth/access_token?state=${app}&code=${code}`,
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