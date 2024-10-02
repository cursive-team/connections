import { appendBackupData, createActivityBackup } from "@/lib/backup";
import { Activity } from "@/lib/storage/types";
import { getUser, saveUser } from "../user";
import { getSession, saveSession } from "../session";

export const addActivity = async (activity: Activity): Promise<void> => {
  const user = getUser();
  const session = getSession();

  if (!user) {
    throw new Error("User not found");
  }
  if (!session || session.authTokenExpiresAt < new Date()) {
    throw new Error("Session expired");
  }

  const activityBackup = createActivityBackup({
    email: user.email,
    password: session.backupMasterPassword,
    activity,
  });

  const { updatedUser, updatedSubmittedAt } = await appendBackupData({
    email: user.email,
    password: session.backupMasterPassword,
    authToken: session.authTokenValue,
    newBackupData: [activityBackup],
    existingUser: user,
    previousSubmittedAt: session.lastBackupFetchedAt,
  });

  saveUser(updatedUser);
  saveSession({
    ...session,
    lastBackupFetchedAt: updatedSubmittedAt,
  });
};
