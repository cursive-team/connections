import {
  ChipIssuer,
  errorToString,
  LeaderboardEntry,
  LeaderboardEntrySchema,
  LeaderboardEntryType,
} from "@types";
import { ManagedChipClient } from "../client";
import {
  Configuration,
  ConfigurationParameters,
  JobApi,
  JobResult,
} from "@taceo/csn-api-client";
import { pollJobResult } from "@/lib/util";

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

ManagedChipClient.prototype.SubmitProofJob = async function (
  username: string,
  jobId: string
) {
  await this.prismaClient.proof.create({
    data: {
      username,
      jobId,
    },
  });
};

ManagedChipClient.prototype.PollProofResults = async function () {
  // Get all incomplete proof jobs
  const incompleteProofs = await this.prismaClient.proof.findMany({
    where: {
      jobCompleted: false,
    },
  });

  if (incompleteProofs.length === 0) {
    return;
  }

  // Setup API instance similar to tap.tsx
  const apiConfig: ConfigurationParameters = {
    basePath: "https://csn-devcon.taceo.io",
    accessToken: "ASV9PkXpy76KRFtmcQeaLbxT75grdilY",
  };
  const configuration = new Configuration(apiConfig);
  const apiInstance = new JobApi(configuration);

  const completedJobs: {
    jobId: string;
    result: JobResult;
    username: string;
    createdAt: Date;
  }[] = [];

  // Check each incomplete proof
  await Promise.all(
    incompleteProofs.map(async (proof) => {
      try {
        const result = await pollJobResult(apiInstance, proof.jobId);

        if (result) {
          // Job completed successfully
          console.log(result);
          completedJobs.push({
            result,
            jobId: proof.jobId,
            username: proof.username,
            createdAt: proof.createdAt,
          });
        }
        // If undefined, job is still processing
      } catch (error) {
        console.error(`Error polling job ${proof.jobId}:`, error);
      }
    })
  );

  // Update all completed jobs
  if (completedJobs.length > 0) {
    const processJobs = completedJobs.map(async (job) => {
      if (!job.result.publicInput) {
        return;
      }

      // parse all properties of job and verify correct public key
      const publicInput = JSON.parse(job.result.publicInput);
      const sigNullifier = publicInput[0];
      const pubkeyNullifier = publicInput[1];
      const pubkeyNullifierRandomnessHash = publicInput[2];
      const cursivePubKeyAx = publicInput[8];
      const cursivePubKeyAy = publicInput[9];
      if (
        !sigNullifier ||
        !pubkeyNullifier ||
        !pubkeyNullifierRandomnessHash ||
        !cursivePubKeyAx ||
        !cursivePubKeyAy
      ) {
        return;
      }
      if (
        cursivePubKeyAx !==
          BigInt(
            "0x1b073e4eede939876ce1deb7491d5d3bf212ba6b574c1c4658b0d72c467af4fb"
          ).toString() ||
        cursivePubKeyAy !==
          BigInt(
            "0x503c38a246469b877b3a9096de70bad25bd41ae302bc9c5dd208b2046ef6e2a"
          ).toString()
      ) {
        return;
      }

      // update the proof job as having completed
      await this.prismaClient.proof.update({
        where: {
          jobId: job.jobId,
        },
        data: {
          sigNullifier: sigNullifier.toString(),
          pubkeyNullifier: pubkeyNullifier.toString(),
          pubkeyNullifierRandomnessHash:
            pubkeyNullifierRandomnessHash.toString(),
          jobCompleted: true,
        },
      });

      // Compute daily leaderboards for Devcon 2024
      const THAILAND_OFFSET = 7; // UTC+7

      const timeWindows = {
        day1: {
          start: new Date("2024-11-12T00:00:00+07:00"), // Nov 12 12AM Thailand
          end: new Date("2024-11-12T18:00:00+07:00"), // Nov 12 6PM Thailand
        },
        day2: {
          start: new Date("2024-11-13T00:00:00+07:00"),
          end: new Date("2024-11-13T18:00:00+07:00"),
        },
        day3: {
          start: new Date("2024-11-14T00:00:00+07:00"),
          end: new Date("2024-11-14T18:00:00+07:00"),
        },
        day4: {
          start: new Date("2024-11-15T00:00:00+07:00"),
          end: new Date("2024-11-15T18:00:00+07:00"),
        },
      };

      // Get all proofs for this user and calculate nullifier counts
      const userProofs = await this.prismaClient.proof.findMany({
        where: {
          username: job.username,
          jobCompleted: true,
        },
      });

      console.log(job.username, userProofs);

      // Verify all pubkeyNullifierRandomnessHash are the same
      const uniquePubkeyNullifierRandomnessHashes = new Set<string>();
      for (const proof of userProofs) {
        if (proof.pubkeyNullifierRandomnessHash) {
          uniquePubkeyNullifierRandomnessHashes.add(
            proof.pubkeyNullifierRandomnessHash
          );
        }
      }
      if (uniquePubkeyNullifierRandomnessHashes.size > 1) {
        return;
      }

      // compute new leaderboard entries for each day
      const pubkeyNullifiersByDay = {
        day1: new Set<string>(),
        day2: new Set<string>(),
        day3: new Set<string>(),
        day4: new Set<string>(),
        total: new Set<string>(),
      };

      for (const proof of userProofs) {
        if (!proof.pubkeyNullifier || !proof.createdAt) continue;

        // Add to total set
        pubkeyNullifiersByDay.total.add(proof.pubkeyNullifier);

        // Convert UTC to Thailand time
        const thailandTime = new Date(proof.createdAt);
        thailandTime.setHours(thailandTime.getHours() + THAILAND_OFFSET);

        // Check which day this proof belongs to
        if (
          thailandTime >= timeWindows.day1.start &&
          thailandTime <= timeWindows.day1.end
        ) {
          pubkeyNullifiersByDay.day1.add(proof.pubkeyNullifier);
        } else if (
          thailandTime >= timeWindows.day2.start &&
          thailandTime <= timeWindows.day2.end
        ) {
          pubkeyNullifiersByDay.day2.add(proof.pubkeyNullifier);
        } else if (
          thailandTime >= timeWindows.day3.start &&
          thailandTime <= timeWindows.day3.end
        ) {
          pubkeyNullifiersByDay.day3.add(proof.pubkeyNullifier);
        } else if (
          thailandTime >= timeWindows.day4.start &&
          thailandTime <= timeWindows.day4.end
        ) {
          pubkeyNullifiersByDay.day4.add(proof.pubkeyNullifier);
        }
      }

      // Update leaderboard entries for each type
      const leaderboardUpdates = [
        {
          entryType: LeaderboardEntryType.DEVCON_2024_TAP_COUNT,
          value: pubkeyNullifiersByDay.total.size,
        },
        {
          entryType: LeaderboardEntryType.DEVCON_2024_DAY_1_TAP_COUNT,
          value: pubkeyNullifiersByDay.day1.size,
        },
        {
          entryType: LeaderboardEntryType.DEVCON_2024_DAY_2_TAP_COUNT,
          value: pubkeyNullifiersByDay.day2.size,
        },
        {
          entryType: LeaderboardEntryType.DEVCON_2024_DAY_3_TAP_COUNT,
          value: pubkeyNullifiersByDay.day3.size,
        },
        {
          entryType: LeaderboardEntryType.DEVCON_2024_DAY_4_TAP_COUNT,
          value: pubkeyNullifiersByDay.day4.size,
        },
      ];

      console.log(pubkeyNullifiersByDay);

      for (const update of leaderboardUpdates) {
        const existingEntry =
          await this.prismaClient.leaderboardEntry.findFirst({
            where: {
              username: job.username,
              chipIssuer: ChipIssuer.DEVCON_2024,
              entryType: update.entryType,
            },
          });

        if (existingEntry) {
          await this.prismaClient.leaderboardEntry.update({
            where: { id: existingEntry.id },
            data: { entryValue: update.value },
          });
        } else {
          await this.prismaClient.leaderboardEntry.create({
            data: {
              username: job.username,
              chipIssuer: ChipIssuer.DEVCON_2024,
              entryType: update.entryType,
              entryValue: update.value,
            },
          });
        }
      }
    });

    await Promise.all(processJobs);
  }
};
