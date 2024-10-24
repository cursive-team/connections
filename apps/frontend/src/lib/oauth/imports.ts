import {
  AccessToken,
  ChipIssuer,
  DataOption,
  LeaderboardEntry, LeaderboardEntryType,
  MapResponseToLeaderboardEntry
} from "@types";

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
  username: string,
  chipIssuer: ChipIssuer,
  token: AccessToken,
  options: DataOption,
): Promise<LeaderboardEntry | null> {

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
    return MapResponseToLeaderboardEntry(username, options.type, chipIssuer, rawData);
  } catch (error) {
    console.error("Error importing data:", error);
    throw error;
  }
}