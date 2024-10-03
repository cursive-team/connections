import { UserData } from "@/lib/storage/types";
import { createUserDataBackup } from "@/lib/backup";
import { getUserAndSession, saveBackupAndUpdateStorage } from "../utils";

export const updateUserData = async (userData: UserData): Promise<void> => {
  const { user, session } = getUserAndSession();

  const userDataBackup = createUserDataBackup({
    email: user.email,
    password: session.backupMasterPassword,
    userData,
  });

  await saveBackupAndUpdateStorage({
    user,
    session,
    newBackupData: [userDataBackup],
  });
};
