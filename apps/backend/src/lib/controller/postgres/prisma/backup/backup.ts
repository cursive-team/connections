import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import {
  Backup,
  BackupCreateRequest,
  BackupSchema,
} from "@/lib/controller/postgres/types";
<<<<<<< HEAD
import { BackupData, BackupDataSchema, CreateBackupData } from "@types";
=======
import { CreateBackupData } from "@types";
>>>>>>> 3229d1d (backend handler for updating backup data)

PrismaPostgresClient.prototype.GetAllBackupsForUser = async function (
  userId: string
): Promise<Backup[]> {
  const prismaBackups = await this.prismaClient.backup.findMany({
    where: {
      userId,
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return prismaBackups.map((prismaBackup: Backup) =>
    BackupSchema.parse(prismaBackup)
  );
};

PrismaPostgresClient.prototype.GetBackupDataAfter = async function (
  userId: string,
  submittedAt: Date
): Promise<Backup[]> {
  const prismaBackups = await this.prismaClient.backup.findMany({
    where: {
      userId,
      submittedAt: {
        gt: submittedAt,
      },
    },
    orderBy: {
      submittedAt: "asc",
    },
  });

  return prismaBackups.map((prismaBackup: Backup) =>
    BackupSchema.parse(prismaBackup)
  );
};

PrismaPostgresClient.prototype.CreateBackup = async function (
  createBackup: BackupCreateRequest
): Promise<Backup> {
  const prismaBackup = await this.prismaClient.backup.create({
    data: createBackup,
  });

  if (prismaBackup) {
    return BackupSchema.parse(prismaBackup);
  }

  return {} as Backup;
};

PrismaPostgresClient.prototype.AppendBackupData = async function (
  userId: string,
  backupData: CreateBackupData[]
<<<<<<< HEAD
): Promise<BackupData[]> {
  let submittedAt = new Date();

  const newBackupData = backupData.map((data, index) => {
    // Offset each submittedAt by a millisecond to retain client ordering
    const offsetSubmittedAt = new Date(submittedAt.getTime() + index);
    return {
=======
): Promise<Date> {
  const submittedAt = new Date();

  await this.prismaClient.backup.createMany({
    data: backupData.map((data) => ({
>>>>>>> 3229d1d (backend handler for updating backup data)
      userId,
      authenticationTag: data.authenticationTag,
      iv: data.iv,
      encryptedData: data.encryptedData,
      backupEntryType: data.backupEntryType,
      clientCreatedAt: data.clientCreatedAt,
<<<<<<< HEAD
      submittedAt: offsetSubmittedAt,
    };
  });

  await this.prismaClient.backup.createMany({
    data: newBackupData,
  });

  return newBackupData.map((backupData: BackupData) =>
    BackupDataSchema.parse(backupData)
  );
=======
      submittedAt,
    })),
  });

  return submittedAt;
>>>>>>> 3229d1d (backend handler for updating backup data)
};
