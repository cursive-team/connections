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

export async function updateTapLeaderboardEntry(
  chipIssuer: ChipIssuer
): Promise<void> {
  const { user, session } = await storage.getUserAndSession();

  // Count total taps and taps for the week starting October 20th
  const weekOct20StartDate = new Date("2024-10-20T00:00:00Z");
  const weeklyCutoffDate = new Date(1729698923);
  let totalTapCount = 0;
  let weekOct20TapCount = 0;

  Object.values(user.connections).forEach((connection) => {
    const tapsFromIssuer = connection.taps.filter(
      (tap) => tap.chipIssuer === chipIssuer
    );
    if (tapsFromIssuer.length > 0) {
      totalTapCount++;

      const validWeeklyTaps = tapsFromIssuer.filter((tap) => {
        const tapDate = new Date(tap.timestamp);
        return tapDate >= weekOct20StartDate && tapDate < weeklyCutoffDate;
      });

      if (validWeeklyTaps.length > 0) {
        weekOct20TapCount += validWeeklyTaps.length;
      } else if (
        tapsFromIssuer.some(
          (tap) => new Date(tap.timestamp) >= weeklyCutoffDate
        )
      ) {
        weekOct20TapCount++;
      }
    }
  });

  try {
    const updateTotalTapsRequest: UpdateLeaderboardEntryRequest = {
      authToken: session.authTokenValue,
      chipIssuer,
      entryType: LeaderboardEntryType.TOTAL_TAP_COUNT,
      entryValue: totalTapCount,
    };

    const updateWeekTapsRequest: UpdateLeaderboardEntryRequest = {
      authToken: session.authTokenValue,
      chipIssuer,
      entryType: LeaderboardEntryType.WEEK_OCT_20_TAP_COUNT,
      entryValue: weekOct20TapCount,
    };

    const requests = [updateTotalTapsRequest, updateWeekTapsRequest];

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
