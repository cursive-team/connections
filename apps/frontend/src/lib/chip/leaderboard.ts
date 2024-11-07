import { BASE_API_URL } from "@/config";
import {
  ChipIssuer,
  LeaderboardEntries,
  LeaderboardEntriesSchema,
  LeaderboardDetails,
  LeaderboardDetailsSchema,
  UpdateLeaderboardEntryRequest,
  LeaderboardEntryType,
} from "@types";
import { storage } from "@/lib/storage";

export async function updateLeaderboardEntry(
  entryRequest: UpdateLeaderboardEntryRequest
): Promise<void> {
  try {
    const response = await fetch(
      `${BASE_API_URL}/chip/update_leaderboard_entry`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(entryRequest),
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

    return;
  } catch (error) {
    console.error("Error updating leaderboard entry:", error);
    throw error;
  }
}

export async function updateLannaWorkoutLeaderboardEntry(): Promise<void> {
  const { user, session } = await storage.getUserAndSession();

  // Count total workouts for Edge City Lanna
  const locations = user.locations || {};
  let totalWorkouts = 0;
  Object.values(locations).forEach((location) => {
    if (location.chipIssuer === ChipIssuer.EDGE_CITY_LANNA) {
      const LANNA_WORKOUT_LOCATION_IDS = [
        "a2902af9-3843-4e5c-8af5-4e48fcc3252a", // Red Dog Gallery
        "d633cded-618a-496e-a91c-c6a4f0a4996a", // Apex Gym
        "02400216-7d81-4ffa-8ada-c498fd0a6c39", // Sting Hive Muay Thai Gym
        "298e6c59-0b87-454e-92e0-9553a826ef64", // Manasak Muay Thai Gym
      ];
      if (LANNA_WORKOUT_LOCATION_IDS.includes(location.id)) {
        totalWorkouts += location.taps.length;
      }
    }
  });

  try {
    const request: UpdateLeaderboardEntryRequest = {
      authToken: session.authTokenValue,
      chipIssuer: ChipIssuer.EDGE_CITY_LANNA,
      entryType: LeaderboardEntryType.LANNA_TOTAL_WORKOUT_COUNT,
      entryValue: totalWorkouts,
    };

    const response = await fetch(
      `${BASE_API_URL}/chip/update_leaderboard_entry`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
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
  } catch (error) {
    console.error("Error updating workout leaderboard entry:", error);
    throw error;
  }
}

export async function updateTapLeaderboardEntry(
  chipIssuer: ChipIssuer
): Promise<void> {
  const { user, session } = await storage.getUserAndSession();

  // Count total taps and taps for the week starting Nov 4
  const weekNov4StartDate = new Date("2024-11-04T00:00:00Z");
  let totalTapCount = 0;
  let weekOct27TapCount = 0;

  Object.values(user.connections).forEach((connection) => {
    const tapsFromIssuer = connection.taps.filter(
      (tap) => tap.chipIssuer === chipIssuer
    );
    if (tapsFromIssuer.length > 0) {
      totalTapCount++;

      const validWeeklyTaps = tapsFromIssuer.filter((tap) => {
        const tapDate = new Date(tap.timestamp);
        return tapDate >= weekNov4StartDate;
      });

      if (validWeeklyTaps.length > 0) {
        weekOct27TapCount++;
      }
    }
  });

  try {
    const requests = [];
    const updateTotalTapsRequest: UpdateLeaderboardEntryRequest = {
      authToken: session.authTokenValue,
      chipIssuer,
      entryType: LeaderboardEntryType.TOTAL_TAP_COUNT,
      entryValue: totalTapCount,
    };
    requests.push(updateTotalTapsRequest);

    if (chipIssuer === ChipIssuer.EDGE_CITY_LANNA) {
      const updateWeekTapsRequest: UpdateLeaderboardEntryRequest = {
        authToken: session.authTokenValue,
        chipIssuer,
        entryType: LeaderboardEntryType.WEEK_NOV_4_TAP_COUNT,
        entryValue: weekOct27TapCount,
      };
      requests.push(updateWeekTapsRequest);
    }

    for (const request of requests) {
      const response = await fetch(
        `${BASE_API_URL}/chip/update_leaderboard_entry`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(request),
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
    }

    return;
  } catch (error) {
    console.error("Error updating leaderboard entries:", error);
    throw error;
  }
}

export async function getUserLeaderboardDetails(
  chipIssuer: ChipIssuer,
  entryType: LeaderboardEntryType
): Promise<LeaderboardDetails | null> {
  const { session } = await storage.getUserAndSession();

  try {
    const response = await fetch(
      `${BASE_API_URL}/chip/get_leaderboard_details?authToken=${session.authTokenValue}&chipIssuer=${chipIssuer}&entryType=${entryType}`,
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
    const parsedData = LeaderboardDetailsSchema.parse(data);

    return parsedData;
  } catch (error) {
    console.error("Error getting user leaderboard position:", error);
    throw error;
  }
}

export async function getTopLeaderboardEntries(
  chipIssuer: ChipIssuer,
  entryType: LeaderboardEntryType,
  count?: number
): Promise<LeaderboardEntries | null> {
  const { session } = await storage.getUserAndSession();

  try {
    const response = await fetch(
      `${BASE_API_URL}/chip/get_top_leaderboard_entries?chipIssuer=${chipIssuer}&entryType=${entryType}&authToken=${
        session.authTokenValue
      }${count ? `&count=${count}` : ""}`,
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
    const parsedData = LeaderboardEntriesSchema.parse(data);

    return parsedData;
  } catch (error) {
    console.error("Error getting top leaderboard entries:", error);
    throw error;
  }
}
