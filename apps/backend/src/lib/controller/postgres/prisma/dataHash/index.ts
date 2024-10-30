import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import {
  CreateDataHash,
  DataHash,
  DataHashMatch,
  DataHashMatchSchema,
  DataHashSchema,
  UpdateDataHash,
} from "@/lib/controller/postgres/types";
import { ChipIssuer } from "@types";

PrismaPostgresClient.prototype.CreatePrivateDataHashes = async function (
  dataHashes: CreateDataHash[]
): Promise<void> {
  await this.prismaClient.privateDataHash.createMany({
    data: dataHashes,
  });
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
  connectionScore: number
): Promise<void> {
  await this.prismaClient.dataHashMatch.create({
    data: { usernameA, usernameB, connectionScore },
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
        createdAt: dataHashMatch.createdAt,
      })
    );
  };
