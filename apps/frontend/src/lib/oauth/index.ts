import {
  AccessToken,
  DataOption,
  FormatEndpoint,
  ChipIssuer,
  LeaderboardEntry,
  MapResponseToLeaderboardEntry,
  MapStravaToAccessToken,
  StravaBearerTokenSchema
} from "@types";
import { OAUTH_APP_MAPPING } from "@/config";

export async function mintOAuthToken(
  code: string,
  app: string,
): Promise<AccessToken | null> {
  try {
    if (!OAUTH_APP_MAPPING[app]) {
      throw new Error("Integration OAuth details are not available.");
    }

    const { id, secret, token_url } = OAUTH_APP_MAPPING[app];

    const response = await fetch(
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
    const parsedData = StravaBearerTokenSchema.parse(data);

    // Convert StravaBearerToken into generic AuthToken
    return MapStravaToAccessToken(parsedData) || null;
  } catch (error) {
    console.error("Error fetching access token:", error);
    throw error;
  }
}

export async function importOAuthData(
  username: string,
  chipIssuer: ChipIssuer,
  token: AccessToken,
  options: DataOption,
): Promise<LeaderboardEntry | null> {

  try {
    const response = await fetch(
      FormatEndpoint(token, options.endpoint),
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.access_token}`,
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

    const rawData = await response.json();

    // Map response to LeaderEntry for each type
    return MapResponseToLeaderboardEntry(username, options.type, chipIssuer, rawData);
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  }
}