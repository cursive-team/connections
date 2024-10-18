import { BASE_API_URL } from "@/config";
import {
  ChipIssuer,
  LeaderboardEntry,
  LeaderboardEntrySchema,
  LeaderboardEntries,
  LeaderboardEntriesSchema,
  LeaderboardDetails,
  LeaderboardDetailsSchema
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

export async function updateLeaderboardEntry(
  connectionUsername: string,
  chipIssuer: ChipIssuer
): Promise<void> {
  const { user, session } = await storage.getUserAndSession();

  // If existing connection with same chip issuer, do nothing
  const existingConnection = user.connections[connectionUsername];
  if (
    existingConnection &&
    existingConnection.taps.some((tap) => tap.chipIssuer === chipIssuer)
  ) {
    return;
  }

  try {
    const response = await fetch(
      `${BASE_API_URL}/chip/update_leaderboard_entry`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authToken: session.authTokenValue, chipIssuer }),
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
  chipIssuer: ChipIssuer
): Promise<LeaderboardEntries | null> {
  const { session } = await storage.getUserAndSession();

  try {

    const response = await fetch(
      `${BASE_API_URL}/chip/get_top_leaderboard_entries?chipIssuer=${chipIssuer}&authToken=${session.authTokenValue}`,
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
