import { BASE_API_URL } from "@/config";
import { ChipIssuer } from "@types";
import { storage } from "@/lib/storage";

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
      `${BASE_API_URL}/user/update_leaderboard_entry`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ authToken: session.authTokenValue, chipIssuer }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    await response.json();
    return;
  } catch (error) {
    console.error("Error updating leaderboard entry:", error);
    throw error;
  }
}
