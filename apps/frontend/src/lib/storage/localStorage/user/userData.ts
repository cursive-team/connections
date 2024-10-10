import { UserData } from "@/lib/storage/types";
import { createUserDataBackup } from "@/lib/backup";
import { saveBackupAndUpdateStorage } from "../utils";
import { getUserAndSession } from ".";

export const updateUserData = async (userData: UserData): Promise<void> => {
  const { user, session } = await getUserAndSession();

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
