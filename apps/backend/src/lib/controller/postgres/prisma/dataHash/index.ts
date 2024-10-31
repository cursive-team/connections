import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import {
  CreateDataHash,
  DataHash,
  DataHashMatch,
  DataHashMatchSchema,
  DataHashSchema,
  PairConnection,
  PairConnectionSchema,
  UpdateDataHash,
} from "@/lib/controller/postgres/types";
import { computeConnectionScore } from "@/lib/util/connectionScore";
import { ChipIssuer } from "@types";

PrismaPostgresClient.prototype.CreatePrivateDataHashes = async function (
  dataHashes: CreateDataHash[]
): Promise<void> {
  // Process each data hash sequentially
  for (const dataHash of dataHashes) {
    const existingEntry = await this.prismaClient.privateDataHash.findFirst({
      where: {
        dataIdentifier: dataHash.dataIdentifier,
      },
    });

    // If the entry exists, update or delete it
    if (existingEntry) {
      if (dataHash.encryptedInput === null) {
        // Delete if encryptedInput is null
        await this.prismaClient.privateDataHash.delete({
          where: {
            id: existingEntry.id,
          },
        });
      } else {
        // Update existing entry
        await this.prismaClient.privateDataHash.update({
          where: {
            id: existingEntry.id,
          },
          data: {
            username: dataHash.username,
            chipIssuer: dataHash.chipIssuer,
            locationId: dataHash.locationId,
            encryptedInput: dataHash.encryptedInput,
            enclavePublicKey: dataHash.enclavePublicKey,
            dataHash: null, // Reset data hash
            secretHash: null, // Reset secret hash
            createdAt: new Date(),
          },
        });
      }
    } else if (dataHash.encryptedInput !== null) {
      // Create new entry
      await this.prismaClient.privateDataHash.create({
        data: {
          username: dataHash.username,
          chipIssuer: dataHash.chipIssuer,
          locationId: dataHash.locationId,
          dataIdentifier: dataHash.dataIdentifier,
          encryptedInput: dataHash.encryptedInput,
          enclavePublicKey: dataHash.enclavePublicKey,
        },
      });
    }
  }
};

PrismaPostgresClient.prototype.GetUnhashedDataHashes =
  async function (): Promise<DataHash[]> {
    const dataHashes = await this.prismaClient.privateDataHash.findMany({
      where: {
        dataHash: null,
      },
    });

    return dataHashes.map((dataHash) => DataHashSchema.parse(dataHash));
  };

PrismaPostgresClient.prototype.UpdateDataHashes = async function (
  dataHashes: UpdateDataHash[]
): Promise<void> {
  await Promise.all(
    dataHashes.map((dataHash) =>
      this.prismaClient.privateDataHash.update({
        where: {
          id: dataHash.id,
        },
        data: {
          dataHash: dataHash.dataHash,
          secretHash: dataHash.secretHash,
        },
      })
    )
  );
};

PrismaPostgresClient.prototype.GetAllUserHashesByChipAndLocation =
  async function (
    chipIssuer: ChipIssuer,
    locationId: string
  ): Promise<Record<string, string[]>> {
    const mostRecentEntry = await this.prismaClient.privateDataHash.findFirst({
      where: {
        chipIssuer,
        locationId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!mostRecentEntry) {
      return {};
    }

    const mostRecentSecretHash = mostRecentEntry.secretHash;

    // Get all data hashes for this chip/location with matching secret hash
    const dataHashes = await this.prismaClient.privateDataHash.findMany({
      where: {
        chipIssuer,
        locationId,
        secretHash: mostRecentSecretHash,
        dataHash: {
          not: null,
        },
      },
      select: {
        username: true,
        dataHash: true,
      },
    });

    // Group data hashes by username
    const hashMap: Record<string, string[]> = {};
    for (const entry of dataHashes) {
      if (!hashMap[entry.username]) {
        hashMap[entry.username] = [];
      }
      if (entry.dataHash) {
        hashMap[entry.username].push(entry.dataHash);
      }
    }

    return hashMap;
  };

PrismaPostgresClient.prototype.CreateDataHashMatch = async function (
  usernameA: string,
  usernameB: string,
  connectionScore: number,
  notificationUsernameA: string | undefined,
  notificationUsernameB: string | undefined
): Promise<void> {
  await this.prismaClient.dataHashMatch.create({
    data: {
      usernameA,
      usernameB,
      connectionScore,
      notificationUsernameA,
      notificationUsernameB,
    },
  });
};

PrismaPostgresClient.prototype.GetAllDataHashMatches =
  async function (): Promise<DataHashMatch[]> {
    const dataHashMatches = await this.prismaClient.dataHashMatch.findMany();
    return dataHashMatches.map((dataHashMatch) =>
      DataHashMatchSchema.parse({
        usernameA: dataHashMatch.usernameA,
        usernameB: dataHashMatch.usernameB,
        connectionScore: Number(dataHashMatch.connectionScore),
        notificationUsernameA: dataHashMatch.notificationUsernameA,
        notificationUsernameB: dataHashMatch.notificationUsernameB,
        createdAt: dataHashMatch.createdAt,
      })
    );
  };

PrismaPostgresClient.prototype.UpdatePairConnection = async function (
  username: string
): Promise<void> {
  // Get latest pair connection
  const latestPairConnection = await this.prismaClient.pairConnection.findFirst(
    {
      orderBy: {
        createdAt: "desc",
      },
    }
  );

  if (!latestPairConnection) {
    // No existing pair connection, create new one with usernameA
    await this.prismaClient.pairConnection.create({
      data: {
        usernameA: username,
      },
    });
  } else if (!latestPairConnection.usernameB) {
    // If this user is usernameA, return early
    if (username === latestPairConnection.usernameA) {
      return;
    }
    // Get private data hashes for both users
    const userAHashes = await this.prismaClient.privateDataHash.findMany({
      where: {
        username: latestPairConnection.usernameA,
        dataHash: {
          not: null,
        },
      },
      select: {
        dataHash: true,
      },
    });
    const userAHashesUnique = [
      ...new Set(
        userAHashes.map((hash) => hash.dataHash).filter((hash) => hash !== null)
      ),
    ];

    const userBHashes = await this.prismaClient.privateDataHash.findMany({
      where: {
        username,
        dataHash: {
          not: null,
        },
      },
      select: {
        dataHash: true,
      },
    });
    const userBHashesUnique = [
      ...new Set(
        userBHashes.map((hash) => hash.dataHash).filter((hash) => hash !== null)
      ),
    ];

    const commonHashCount = userAHashesUnique.filter((hashA) =>
      userBHashesUnique.includes(hashA)
    ).length;

    // Compute connection score between the users' data hashes
    const connectionScore = computeConnectionScore(
      userAHashesUnique.length,
      userBHashesUnique.length,
      commonHashCount
    );

    // Update with usernameB and score
    await this.prismaClient.pairConnection.update({
      where: {
        id: latestPairConnection.id,
      },
      data: {
        usernameB: username,
        connectionScore,
      },
    });
  } else {
    // Both usernames exist, create new pair connection
    await this.prismaClient.pairConnection.create({
      data: {
        usernameA: username,
      },
    });
  }
};

PrismaPostgresClient.prototype.GetLatestPairConnection =
  async function (): Promise<PairConnection | null> {
    const latestPairConnection =
      await this.prismaClient.pairConnection.findFirst({
        orderBy: {
          createdAt: "desc",
        },
      });

    return latestPairConnection
      ? PairConnectionSchema.parse({
          ...latestPairConnection,
          connectionScore: Number(latestPairConnection.connectionScore),
        })
      : null;
  };
