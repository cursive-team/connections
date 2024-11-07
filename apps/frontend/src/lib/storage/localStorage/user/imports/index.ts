import { saveBackupAndUpdateStorage } from "@/lib/storage/localStorage/utils";
import { getUserAndSession } from "..";
import { createAppImportBackup } from "@/lib/backup";
import { AppImport } from "@/lib/storage/types";
import { CreateBackupData } from "@types";

export const addAppImport = async (appImport: AppImport): Promise<void> => {
  const { user, session } = await getUserAndSession();

  const chipIssuerImportBackup: CreateBackupData = createAppImportBackup({
    email: user.email,
    password: session.backupMasterPassword,
    appImport: appImport,
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [chipIssuerImportBackup],
  });
};