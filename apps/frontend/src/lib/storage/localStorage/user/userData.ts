import { UserData } from "@/lib/storage/types";
import { getUser, saveUser } from "./index";
import { getSession, saveSession } from "../session";
import { appendBackupData, createUserDataBackup } from "@/lib/backup";

export const updateUserData = async (userData: UserData): Promise<void> => {
  const user = getUser();
  const session = getSession();

  if (!user) {
    throw new Error("User not found");
  }
  if (!session || session.authTokenExpiresAt < new Date()) {
    throw new Error("Session expired");
  }

  const userDataBackup = createUserDataBackup({
    email: user.email,
    password: session.backupMasterPassword,
    userData,
  });

  const { updatedUser, updatedSubmittedAt } = await appendBackupData({
    email: user.email,
    password: session.backupMasterPassword,
    authToken: session.authTokenValue,
    newBackupData: [userDataBackup],
    existingUser: user,
    previousSubmittedAt: session.lastBackupFetchedAt,
  });

  saveUser(updatedUser);
  saveSession({
    ...session,
    lastBackupFetchedAt: updatedSubmittedAt,
  });
};
