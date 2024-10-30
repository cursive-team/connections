import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import {
  CreateDataHash,
  DataHash,
  DataHashSchema,
  UpdateDataHash,
} from "@/lib/controller/postgres/types";

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
