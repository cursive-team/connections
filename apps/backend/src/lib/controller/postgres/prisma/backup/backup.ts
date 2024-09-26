import { PrismaPostgresClient } from "@/lib/controller/postgres/prisma/client";
import {Backup, BackupCreateRequest, BackupSchema} from "@/lib/controller/postgres/types";

PrismaPostgresClient.prototype.CreateBackup = async function (createBackup: BackupCreateRequest): Promise<Backup> {
  const prismaBackup = await this.prismaClient.backup.create({
    data: createBackup,
  });

  if (prismaBackup) {
    return BackupSchema.parse(prismaBackup);
  }

  return {} as Backup;
}
