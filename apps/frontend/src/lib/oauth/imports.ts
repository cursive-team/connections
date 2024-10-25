import {
  AccessToken,
  ChipIssuer,
  DataOption,
  LeaderboardEntryType,
  UpdateLeaderboardEntryRequest,
} from "@types";

import {
  MapResponseToLeaderboardEntryRequest
} from '@/lib/oauth/strava';

async function fetchData(token: AccessToken, options: DataOption): Promise<Response | null> {
  switch(options.type) {
    case LeaderboardEntryType.STRAVA_PREVIOUS_MONTH_RUN_DISTANCE:
      return await stravaFetch(token);
    default:
      return null;
  }
}

async function stravaFetch(token: AccessToken): Promise<Response> {
  return fetch(
    `https://www.strava.com/api/v3/athletes/${token.user_id}/stats`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token.access_token}`,
      },
    }
  );
}

export async function importOAuthData(
  authToken: string,
  chipIssuer: ChipIssuer,
  token: AccessToken,
  options: DataOption,
): Promise<UpdateLeaderboardEntryRequest | null> {

  try {
    const response = await fetchData(token, options);
    if (!response) {
      throw new Error("no response");
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

    const rawData = await response.json();

    // Map response to LeaderboardEntry for each type
    return MapResponseToLeaderboardEntryRequest(authToken, options.type, chipIssuer, rawData);
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  }
}