import {
  ChipIssuer,
  errorToString,
  LeaderboardEntry,
  LeaderboardEntrySchema,
  LeaderboardEntryType,
} from "@types";
import { ManagedChipClient } from "../client";

ManagedChipClient.prototype.UpdateLeaderboardEntry = async function (
  username: string,
  chipIssuer: ChipIssuer,
  entryType: LeaderboardEntryType,
  entryValue: number
): Promise<void> {
  try {
    // TODO: This is a temporary solution to handle the lanna total tap count.
    // In the future, we will migrate this to the general leaderboard entry update.
    if (
      chipIssuer === ChipIssuer.EDGE_CITY_LANNA &&
      entryType === LeaderboardEntryType.TOTAL_TAP_COUNT
    ) {
      // Find the existing leaderboard entry for the user and chip issuer
      const existingEntry = await this.prismaClient.leaderboardEntry.findFirst({
        where: {
          username,
          chipIssuer: ChipIssuer.EDGE_CITY_LANNA,
        },
      });

      if (existingEntry) {
        // If an entry exists, update the tap count
        await this.prismaClient.leaderboardEntry.update({
          where: { id: existingEntry.id },
          data: { tapCount: entryValue },
        });
      } else {
        // If no entry exists, create a new one
        await this.prismaClient.leaderboardEntry.create({
          data: {
            username,
            chipIssuer: ChipIssuer.EDGE_CITY_LANNA,
            tapCount: entryValue,
          },
        });
      }

      return;
    }

    // Find the existing leaderboard entry for the user and chip issuer
    const existingEntry = await this.prismaClient.leaderboardEntry.findFirst({
      where: {
        username,
        chipIssuer,
        entryType,
      },
    });

    if (existingEntry) {
      // If an entry exists, update with the new value
      await this.prismaClient.leaderboardEntry.update({
        where: { id: existingEntry.id },
        data: { entryValue },
      });
    } else {
      // If no entry exists, create a new one with the provided value
      await this.prismaClient.leaderboardEntry.create({
        data: {
          username,
          chipIssuer,
          entryType,
          entryValue,
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
  chipIssuer: ChipIssuer,
  entryType: LeaderboardEntryType
): Promise<number | null> {
  const leaderboardEntries = await this.GetTopLeaderboardEntries(
    chipIssuer,
    entryType,
    undefined
  );

  if (!leaderboardEntries) {
    return null;
  }

  return (
    leaderboardEntries.findIndex((entry) => entry.username === username) + 1
  );
};

ManagedChipClient.prototype.GetLeaderboardTotalValue = async function (
  chipIssuer: ChipIssuer,
  entryType: LeaderboardEntryType
): Promise<number | null> {
  // TODO: This is a temporary solution to handle the lanna total tap count.
  // In the future, we will migrate this to the general leaderboard entry update.
  if (
    chipIssuer === ChipIssuer.EDGE_CITY_LANNA &&
    entryType === LeaderboardEntryType.TOTAL_TAP_COUNT
  ) {
    const totalValue = await this.prismaClient.leaderboardEntry.aggregate({
      _sum: {
        tapCount: true,
      },
      where: {
        chipIssuer,
        entryType: null,
      },
    });

    return totalValue._sum.tapCount ?? 0;
  }

  const totalValue = await this.prismaClient.leaderboardEntry.aggregate({
    _sum: {
      entryValue: true,
    },
    where: {
      chipIssuer,
      entryType,
    },
  });

  return totalValue._sum.entryValue?.toNumber() ?? 0;
};

// Get contributors from chip service rather than postgres.
// While postgres handles user details, the chip service builds up a record of its community members through entries.
// LeaderboardEntry count can represent the number of contributors.
ManagedChipClient.prototype.GetLeaderboardTotalContributors = async function (
  chipIssuer: ChipIssuer,
  entryType: LeaderboardEntryType
): Promise<number | null> {
  // TODO: This is a temporary solution to handle the lanna total tap count.
  // In the future, we will migrate this to the general leaderboard entry update.
  if (
    chipIssuer === ChipIssuer.EDGE_CITY_LANNA &&
    entryType === LeaderboardEntryType.TOTAL_TAP_COUNT
  ) {
    const totalContributors = await this.prismaClient.leaderboardEntry.count({
      where: {
        chipIssuer,
        entryType: null,
      },
    });
    return totalContributors;
  }

  const totalContributors = await this.prismaClient.leaderboardEntry.count({
    where: {
      chipIssuer,
      entryType,
    },
  });

  return totalContributors;
};

ManagedChipClient.prototype.GetTopLeaderboardEntries = async function (
  chipIssuer: ChipIssuer,
  entryType: LeaderboardEntryType,
  count: number | undefined
): Promise<LeaderboardEntry[] | null> {
  try {
    // TODO: This is a temporary solution to handle the lanna total tap count.
    // In the future, we will migrate this to the general leaderboard entry update.
    if (
      chipIssuer === ChipIssuer.EDGE_CITY_LANNA &&
      entryType === LeaderboardEntryType.TOTAL_TAP_COUNT
    ) {
      const topEntries = await this.prismaClient.leaderboardEntry.findMany({
        where: {
          chipIssuer,
          entryType: null,
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

      const results: LeaderboardEntry[] = topEntries.map((entry) => {
        return LeaderboardEntrySchema.parse({
          username: entry.username,
          entryValue: entry.tapCount ? Number(entry.tapCount) : 0,
        });
      });

      return results;
    }

    const topEntries = await this.prismaClient.leaderboardEntry.findMany({
      where: {
        chipIssuer,
        entryType,
      },
      take: count,
      orderBy: [
        {
          entryValue: "desc",
        },
        {
          // order on username so that ties have a consistent order
          username: "asc",
        },
      ],
    });

    const results: LeaderboardEntry[] = topEntries.map((entry) => {
      return LeaderboardEntrySchema.parse({
        username: entry.username,
        entryValue: entry.entryValue ? Number(entry.entryValue) : 0,
      });
    });

    return results;
  } catch (error) {
    console.error(
      "Failed to get top leaderboard entries:",
      errorToString(error)
    );
    throw new Error("Failed to get top leaderboard entries");
  }
};
