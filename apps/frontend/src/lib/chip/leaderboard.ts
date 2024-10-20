import { BASE_API_URL } from "@/config";
import {
  ChipIssuer,
  LeaderboardEntry,
  LeaderboardEntrySchema,
  LeaderboardEntries,
  LeaderboardEntriesSchema,
  LeaderboardDetails,
  LeaderboardDetailsSchema,
<<<<<<< HEAD
=======
  UpdateLeaderboardEntryRequest,
  LeaderboardEntryType,
>>>>>>> b564cfa (add new leaderboard entry schema)
} from "@types";
import { storage } from "@/lib/storage";

export async function getLeaderboardEntry(
  chipIssuer: ChipIssuer
): Promise<LeaderboardEntry | null> {
  const { session } = await storage.getUserAndSession();

  try {
    const response = await fetch(
      `${BASE_API_URL}/chip/get_leaderboard_entry?chipIssuer=${chipIssuer}&authToken=${session.authTokenValue}`,
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
    const parsedData = LeaderboardEntrySchema.parse(data);

    return parsedData;
  } catch (error) {
    console.error("Error getting leaderboard entry:", error);
    throw error;
  }
}

export async function updateTapLeaderboardEntry(
  chipIssuer: ChipIssuer
): Promise<void> {
  const { user, session } = await storage.getUserAndSession();

  // Count total taps and taps for the week starting October 20th
  const weekOct20StartDate = new Date("2024-10-20T00:00:00Z");
  let totalTapCount = 0;
  let weekOct20TapCount = 0;

  Object.values(user.connections).forEach((connection) => {
    connection.taps.forEach((tap) => {
      if (tap.chipIssuer === chipIssuer) {
        totalTapCount++;
        if (new Date(tap.timestamp) >= weekOct20StartDate) {
          weekOct20TapCount++;
        }
      }
    });
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
  chipIssuer: ChipIssuer
): Promise<LeaderboardDetails | null> {
  const { session } = await storage.getUserAndSession();

  try {
    const response = await fetch(
      `${BASE_API_URL}/chip/get_leaderboard_details?chipIssuer=${chipIssuer}&authToken=${session.authTokenValue}`,
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
  count?: number
): Promise<LeaderboardEntries | null> {
  const { session } = await storage.getUserAndSession();

  try {
    const response = await fetch(
      `${BASE_API_URL}/chip/get_top_leaderboard_entries?chipIssuer=${chipIssuer}&authToken=${
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
