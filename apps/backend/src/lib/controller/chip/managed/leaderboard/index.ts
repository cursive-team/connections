import {
  ChipIssuer,
  errorToString,
  LeaderboardEntry,
  LeaderboardEntrySchema,
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
): Promise<number | null> {
  try {
    /*
    1. Get list of entries for chipIssuer, ordered on descending tap count
    subquery1 = SELECT * FROM "LeaderboardEntry" WHERE "chipIssuer"='TESTING' ORDER BY "tapCount" DESC

    2. Select username and calculated row number from entries
    subquery2 = SELECT username, row_number() OVER() as "leaderboardPosition" FROM (subquery1) AS sorted_entries

    3. Select row number based on username
    query = SELECT row_number FROM (subquery2) AS filtered_entries WHERE "username"='pass2';

    Working query:
    SELECT "leaderboardPosition" FROM (SELECT username, row_number() OVER() as "leaderboardPosition" FROM (SELECT * FROM "LeaderboardEntry" WHERE "chipIssuer"='TESTING' ORDER BY "tapCount" DESC) AS sorted_entries) AS rowed_sorted_entries WHERE "username"='pass2';
    */

    const positions: Array<{ leaderboardPosition: number } | null> = await this
      .prismaClient
      .$queryRaw`SELECT "leaderboardPosition" FROM (SELECT username, row_number() OVER() as "leaderboardPosition" FROM (SELECT * FROM "LeaderboardEntry" WHERE "chipIssuer"=${chipIssuer} ORDER BY "tapCount" DESC) AS sorted_entries) AS rowed_sorted_entries WHERE "username"=${username}`;

    let length = -1;
    if (positions && positions.length == 1 && positions[0] !== null) {
      // Position should always be length 1. 0 indicates the user doesn't exist, and 2 indicates multiple users with same name.
      return Number(positions[0].leaderboardPosition);
    } else if (positions && positions.length == 0) {
      return -1;
    } else if (positions) {
      // I think this is overly defensive and the return value will _never_ be null, but doing it just in case -- -1 would indicate null
      length = positions.length;
    }

    throw new Error(
      `Failed to get user leaderboard position, return value of length ${length}`
    );
  } catch (error) {
    console.error("Failed to get leaderboard position:", errorToString(error));
    throw new Error("Failed to get leaderboard position");
  }
};

ManagedChipClient.prototype.GetLeaderboardTotalTaps = async function (
  chipIssuer: ChipIssuer
): Promise<number | null> {
  try {
    const totalTaps: Array<{ sum: number } | null> = await this.prismaClient
      .$queryRaw`SELECT SUM("tapCount") FROM "LeaderboardEntry" WHERE "chipIssuer"=${chipIssuer}`;

    let length = -1;
    if (totalTaps && totalTaps.length == 1 && totalTaps[0] !== null) {
      // size of totalTaps should always be 1
      return Number(totalTaps[0].sum);
    } else if (totalTaps) {
      // in case the query returns an unexpected result
      length = totalTaps.length;
    }
    throw new Error(
      `Failed to get total taps of leaderboard entries, return value of length ${length}`
    );
  } catch (error) {
    console.error(
      "Failed to get total taps of leaderboard entries:",
      errorToString(error)
    );
    throw new Error("Failed to get total taps of leaderboard entries");
  }

  return null;
};

// Get contributors from chip service rather than postgres.
// While postgres handles user details, the chip service builds up a record of its community members through entries.
// LeaderboardEntry count can represent the number of contributors.
ManagedChipClient.prototype.GetLeaderboardTotalContributors = async function (
  chipIssuer: ChipIssuer
): Promise<number | null> {
  try {
    // There should be one distinct entry per user-leaderboard
    const totalContributors: Array<{ count: number } | null> = await this
      .prismaClient
      .$queryRaw`SELECT COUNT(*) FROM "LeaderboardEntry" WHERE "chipIssuer"=${chipIssuer}`;

    let length = -1;
    if (
      totalContributors &&
      totalContributors.length == 1 &&
      totalContributors[0] !== null
    ) {
      // List of total contributors should always be length 1
      return Number(totalContributors[0].count);
    } else if (totalContributors) {
      // in case the query returns an unexpected result
      length = totalContributors.length;
    }
    throw new Error(
      `Failed to get total taps of leaderboard entries, return value of length ${length}`
    );
  } catch (error) {
    console.error(
      "Failed to get total contributor count of leaderboard:",
      errorToString(error)
    );
    throw new Error("Failed to get total contributor count of leaderboard");
  }

  return null;
};

ManagedChipClient.prototype.GetTopLeaderboard = async function (
  count: number,
  chipIssuer: ChipIssuer
): Promise<LeaderboardEntry[] | null> {
  try {
    const topEntries = await this.prismaClient.leaderboardEntry.findMany({
      where: {
        chipIssuer,
      },
      take: count,
      orderBy: [
        {
          tapCount: "desc",
        },
        {
          // order on username so that ties have a consistent order
          username: "asc",
        },
      ],
    });

    topEntries.map((entry: LeaderboardEntry) => {
      LeaderboardEntrySchema.parse(entry);
    });

    return topEntries;
  } catch (error) {
    console.error(
      "Failed to get top leaderboard entries:",
      errorToString(error)
    );
    throw new Error("Failed to get top leaderboard entries");
  }
};
