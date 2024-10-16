import {
  ChipIssuer,
  errorToString,
  LeaderboardEntry,
  LeaderboardEntrySchema,
  LeaderboardPosition,
  LeaderboardPositionSchema
} from "@types";
import { ManagedChipClient } from "../client";

ManagedChipClient.prototype.GetLeaderboardEntry = async function (
  username: string,
  chipIssuer: ChipIssuer
): Promise<LeaderboardEntry | null> {
  try {
    // Find the existing leaderboard entry for the user and chip issuer
    const existingEntry = await this.prismaClient.leaderboardEntry.findFirst({
      where: {
        username,
        chipIssuer,
      },
    });

    return LeaderboardEntrySchema.parse(existingEntry);
  } catch (error) {
    console.error("Failed to get leaderboard entry:", errorToString(error));
    throw new Error("Failed to get leaderboard entry");
  }
};

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

ManagedChipClient.prototype.GetUserLeaderboardPosition = async function (
  username: string,
  chipIssuer: ChipIssuer
): Promise<LeaderboardPosition | null> {
  try {

    /*
    1. Get ordered list of entries for chipIssuer, only return username and calculated row number
    subquery1 = SELECT username, row_number() OVER() as "leaderboardPosition" FROM "LeaderboardEntry" WHERE "chipIssuer"='TESTING' ORDER BY "tapCount" DESC

    2. Return row number of specific user
    SELECT "leaderboardPosition" FROM (subquery1) AS rowed_sorted_entries WHERE username=${}

    Working query:
    SELECT "leaderboardPosition" FROM (SELECT username, row_number() OVER() as "leaderboardPosition" FROM "LeaderboardEntry" WHERE "chipIssuer"='TESTING' ORDER BY "tapCount" DESC) AS rowed_sorted_entries WHERE "username"='pass2';
    */

    const positions: Array<any> | null = await this.prismaClient.$queryRaw`SELECT "leaderboardPosition" FROM (SELECT username, row_number() OVER() as "leaderboardPosition" FROM "LeaderboardEntry" WHERE "chipIssuer"=${chipIssuer} ORDER BY "tapCount" DESC) AS rowed_sorted_entries WHERE "username"=${username}`;

    let length = -1;
    if (positions && positions.length == 1) {
      // Position should always be length 1. 0 indicates the user doesn't exist, and 2 indicates multiple users with same name.
      return LeaderboardPositionSchema.parse(positions[0]);
    } else if (positions) {
      // I think this is overly defensive and the return value will _never_ be null, but doing it just in case -- -1 would indicate null
      length = positions.length;
    }

    throw new Error(`Failed to get user leaderboard position, return value of length ${length}`);
  } catch (error) {
    console.error("Failed to get leaderboard entry:", errorToString(error));
    throw new Error("Failed to get leaderboard entry");
  }
};

ManagedChipClient.prototype.GetTopLeaderboard = async function (
  count: number,
  chipIssuer: ChipIssuer
): Promise<LeaderboardEntry[] | null> {
  try {
    // In this scheme there's currently no way to decide ties, ie ties may change order.
    const topEntries = await this.prismaClient.leaderboardEntry.findMany({
      where: {
        chipIssuer,
      },
      take: count,
      orderBy: {
        tapCount: "desc",
      },
    });

    topEntries.map((entry: LeaderboardEntry) => {
      LeaderboardEntrySchema.parse(entry)
    });

    return topEntries;
  } catch (error) {
    console.error("Failed to get leaderboard entry:", errorToString(error));
    throw new Error("Failed to get leaderboard entry");
  }
};

