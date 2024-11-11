import { DataImportSource } from "@types";
import { UserData } from "@/lib/storage/types";
import { getUserAndSession } from "@/lib/storage/localStorage/user/index";
import { createUserDataBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "@/lib/storage/localStorage/utils";

export const deleteAppImports = async (
  app: DataImportSource
): Promise<void> => {
  const { user, session } = await getUserAndSession();

  let updatedUserData: UserData = user.userData;
  if (!updatedUserData) {
    return;
  }

  for (const fieldName of Object.keys(updatedUserData)) {
    if (fieldName === app.toString()) {
      updatedUserData = {...updatedUserData, [fieldName]: undefined};
    }
  }

  const importDeletionBackup = createUserDataBackup({
    email: user.email,
    password: session.backupMasterPassword,
    userData: updatedUserData,
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [importDeletionBackup],
  });
};