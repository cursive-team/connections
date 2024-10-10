import { ChipIssuer, errorToString } from "@types";
import { ManagedChipClient } from "../client";

ManagedChipClient.prototype.UpdateLeaderboardEntry = async function (
  username: string,
  chipIssuer: ChipIssuer
): Promise<void> {
  try {
    // Find the existing leaderboard entry for the user and chip issuer
    const existingEntry = await this.prismaClient.leaderboardEntry.findFirst({
      where: {
        username,
        chipIssuer,
      },
    });

    if (existingEntry) {
      // If an entry exists, increment the tap count
      await this.prismaClient.leaderboardEntry.update({
        where: { id: existingEntry.id },
        data: { tapCount: { increment: 1 } },
      });
    } else {
      // If no entry exists, create a new one with tap count 1
      await this.prismaClient.leaderboardEntry.create({
        data: {
          username,
          chipIssuer,
          tapCount: 1,
        },
      });
    }
  } catch (error) {
    console.error("Failed to update leaderboard entry:", errorToString(error));
    throw new Error("Failed to update leaderboard entry");
  }
};
